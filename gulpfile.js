var cmd = require("node-cmd"),
  gulp = require("gulp"),
  config = require("./config.json"),
  gulpSequence = require("gulp-sequence"),
  PluginError = require("plugin-error"),
  readlineSync = require("readline-sync"),
  fs = require("fs");

gulp.task("task", function (cb) {
  cmd.get("ping localhost -t 5", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task("update-cobol", function (callback) {
  //   var command = "zowe endevor generate element " + config.testElement + " --type COBOL --override-signout --maxrc 0 --stage-number 1";
  var command =
    "zowe  endevor update element MARBLE07 --env SMPLTEST --sys MARBLES --sub MARBLES --typ COBOL --override-signout --ff COBOL/MARBLE07.cobol -i ENDEVOR --comment ysk1 --ccid ysk1";
  //    "zowe  endevor update element MARBLE07 --env SMPLTEST --sys MARBLES --sub MARBLES --typ COBOL --override-signout --ff MARBLE07.cbl -i ENDEVOR --comment ysk1 --ccid ysk1";

  simpleCommand(command, "command-archive/update-cobol", callback);
});

gulp.task("build-cobol", function (callback) {
  //   var command = "zowe endevor generate element " + config.testElement + " --type COBOL --override-signout --maxrc 0 --stage-number 1";
  var command =
    "zowe endevor generate element MARBLE07 --env SMPLTEST --sn 1 --sys MARBLES --sub MARBLES --type COBOL --override-signout --cb -i ENDEVOR --comment test223 --ccid abcd";

  simpleCommand(command, "command-archive/build-cobol", callback);
});

//    var command = "zowe endevor generate element " + config.testElement + " --type COBOL --override-signout --maxrc 0 --stage-number 1";
//var command = "zowe  endevor update element FINARP05 --env SMPLTEST --sys --sub ACCTPAY --typ COBOL --ff MARBLE07.cbl -i ENDEVOR --comment test9 --ccid abcd9";
//var  command = "zowe endevor generate element FAPCOB05 --env SMPLTEST --sn 1 --sys FINANCE --sub ACCTPAY --type COBOL --cb -i ENDEVOR --comment test223 --ccid abcd";
//     var command = "zowe  endevor list elements -i ENDEVOR --env SMPLTEST --sn 1 --sys FINANCE --sub ACCTPAY --typ COBOL" ;

gulp.task("build-lnk", function (callback) {
  //  var command = "zowe endevor generate element " + config.testElement + " --type LNK --override-signout --maxrc 0 --stage-number 1";
  var command =
    "zowe endevor generate element MARBLE07 --env SMPLTEST --sn 1 --sys MARBLES --sub MARBLES --type LNK --cb -i ENDEVOR --comment test223 --ccid abcd --os";
  simpleCommand(command, "command-archive/build-lnk", callback);
});

gulp.task("copy-load", function (callback) {
  var command =
    'zowe file-master-plus copy data-set "' +
    config.devLOADLIB +
    '" "' +
    config.testLOADLIB +
    '" -m ' +
    config.testElement;
  //var command = 'zowe zos-extended-files copy data-set "KWOYO01.JCL(A)" "KWOYO01.DUMMY.JCL(A)" --replace';

  simpleCommand(command, "command-archive/copy-load", callback);
});

gulp.task("copy-dbrm", function (callback) {
  var command =
    'zowe file-master-plus copy data-set "' +
    config.devDBRMLIB +
    '" "' +
    config.testDBRMLIB +
    '" -m ' +
    config.testElement;
  //var command = 'zowe zos-extended-files copy data-set "KWOYO01.MARBLES.DBRMLIB(MARBLE07)" "KWOYO01.MARBLES.T12M.DBRMLIB(MARBLE07)" --replace';

  simpleCommand(command, "command-archive/copy-dbrm", callback);
});

gulp.task("cics-refresh", function (callback) {
  // var command = 'zowe cics refresh program "' + config.cicsProgram + '"';
  var command =
    'zowe cics refresh program "' +
    config.cicsProgram +
    '"' +
    ' --region-name "' +
    config.cicsRegion +
    '"';

  simpleCommand(command, "command-archive/cics-refresh", callback);
});

gulp.task("bind-n-grant", function (callback) {
  var ds = config.bindGrantJCL;
  submitJobAndDownloadOutput(ds, "job-archive/bind-n-grant", 4, callback);
});

gulp.task("test-tran", function (callback) {
  var ds = config.testTranJCL;
  submitJobAndDownloadOutput(ds, "job-archive/test-tran", 4, callback);
});

gulp.task("verify-data", function (callback) {
  var ds = config.sqlJCL;
  submitJobAndDownloadOutput(ds, "job-archive/verify-data", 4, callback);
});

gulp.task("build", gulpSequence("build-cobol", "build-lnk"));

gulp.task(
  "deploy",
  gulpSequence("copy-dbrm", "copy-load", "bind-n-grant", "cics-refresh")
);

gulp.task("setupProfiles", function (callback) {
  var host, user, pass;
  host = readlineSync.question("Host name or IP address: ");
  user = readlineSync.question("Username: ");
  pass = readlineSync.question("Password: ", { hideEchoBack: true });
  createAndSetProfiles(host, user, pass, callback);
});

/**
 * await Job Callback - Callback is made without error if Job completes with
 * CC < MaxRC in the allotted time
 * @callback awaitJobCallback
 * @param {Error} err
 */

/**
 * commandObject - object contains command to submit and directory to download output to
 * @object commandObject
 * @param {string} command Command to submit
 * @param {string} dir     Directory to download command output to
 */

/**
 * Creates zw (Zowe-Workshop) profiles for project and sets them as default
 * @param {string}           host     z/OS host the project is running against
 * @param {string}           user     username
 * @param {string}           pass     password
 * @param {awaitJobCallback} callback function to call after completion
 */
function createAndSetProfiles(host, user, pass, callback) {
  var commands = [
    {
      command:
        "zowe profiles create zosmf zw --host " +
        host +
        " --user " +
        user +
        " --pass " +
        pass +
        " --port " +
        config.zosmfPort +
        " --ru " +
        config.zosmfRejectUnauthorized +
        " --ow",
      dir: "command-archive/create-zosmf-profile",
    },
    {
      command: "zowe profiles set zosmf zw",
      dir: "command-archive/set-zosmf-profile",
    },
    {
      command:
        "zowe profiles create endevor zw --host " +
        host +
        " --user " +
        user +
        " --pass " +
        pass +
        " --port " +
        config.endevorPort +
        " --ru " +
        config.endevorRejectUnauthorized +
        " --protocol " +
        config.endevorProtocol +
        " --ow",
      dir: "command-archive/create-endevor-profile",
    },
    {
      command: "zowe profiles set endevor zw",
      dir: "command-archive/set-endevor-profile",
    },
    {
      command:
        "zowe profiles create endevor-location zw --instance " +
        config.endevorInstance +
        " --environment " +
        config.endevorEnvironment +
        " --system " +
        config.endevorSystem +
        " --subsystem " +
        config.endevorSubsystem +
        " --ccid " +
        user +
        " --maxrc 0 --stage-number 1 --comment " +
        user +
        " --ow",
      dir: "command-archive/create-endevor-location-profile",
    },
    {
      command: "zowe profiles set endevor-location zw",
      dir: "command-archive/set-endevor-location-profile",
    },
    {
      command:
        "zowe profiles create fmp zw --host " +
        host +
        " --user " +
        user +
        " --pass " +
        pass +
        " --port " +
        config.fmpPort +
        " --ru " +
        config.fmpRejectUnauthorized +
        " --protocol " +
        config.fmpProtocol +
        " --ow",
      dir: "command-archive/create-fmp-profile",
    },
    {
      command: "zowe profiles set fmp zw",
      dir: "command-archive/set-fmp-profile",
    },
    {
      command:
        "zowe profiles create cics zw --host " +
        host +
        " --user " +
        user +
        " --password " +
        pass +
        " --port " +
        config.cicsPort +
        " --region-name " +
        config.cicsRegion +
        " --protocol " +
        config.cicsProtocol +
        " --ow",
      dir: "command-archive/create-cics-profile",
    },
    {
      command: "zowe profiles set cics zw",
      dir: "command-archive/set-cics-profile",
    },
    {
      command:
        "zowe profiles create db2 zw --host " +
        host +
        " --user " +
        user +
        " --pass " +
        pass +
        " --port " +
        config.db2Port +
        " --database " +
        config.db2Database +
        " --ow",
      dir: "command-archive/create-db2-profile",
    },
    {
      command: "zowe profiles set db2 zw",
      dir: "command-archive/set-db2-profile",
    },
  ];
  submitMultipleSimpleCommands(commands, callback);
}

/**
 * Runs command and calls back without error if successful
 * @param {string}           command           command to run
 * @param {string}           dir               directory to log output to
 * @param {awaitJobCallback} callback          function to call after completion
 * @param {Array}            [expectedOutputs] array of expected strings to be in the output
 */
function simpleCommand(command, dir, callback, expectedOutputs) {
  cmd.get(command, function (err, data, stderr) {
    //log output
    var content =
      "Error:\n" + err + "\n" + "StdErr:\n" + stderr + "\n" + "Data:\n" + data;
    writeToFile(dir, content);

    if (err) {
      callback(err);
    } else if (stderr) {
      callback(
        new Error("\nCommand:\n" + command + "\n" + stderr + "Stack Trace:")
      );
    } else if (typeof expectedOutputs !== "undefined") {
      verifyOutput(data, expectedOutputs, callback);
    } else {
      callback();
    }
  });
}

/**
 * Submits job, verifies successful completion, stores output
 * @param {string}           ds                  data-set to submit
 * @param {string}           [dir="job-archive"] local directory to download spool to
 * @param {number}           [maxRC=0]           maximum allowable return code
 * @param {awaitJobCallback} callback            function to call after completion
 */
function submitJobAndDownloadOutput(
  ds,
  dir = "job-archive",
  maxRC = 0,
  callback
) {
  var command = 'zowe jobs submit data-set "' + ds + '" -d ' + dir + " --rfj";
  //var command = 'zowe jobs submit data-set "KWOYO01.JCL(SAMPJCL1)" --rff jobid --rft string';

  cmd.get(command, function (err, data, stderr) {
    //log output
    var content =
      "Error:\n" + err + "\n" + "StdErr:\n" + stderr + "\n" + "Data:\n" + data;
    writeToFile("command-archive/job-submission", content);

    if (err) {
      callback(err);
    } else if (stderr) {
      callback(
        new Error("\nCommand:\n" + command + "\n" + stderr + "Stack Trace:")
      );
    } else {
      data = JSON.parse(data).data;
      retcode = data.retcode;

      //retcode should be in the form CC nnnn where nnnn is the return code
      if (retcode.split(" ")[1] <= maxRC) {
        callback(null);
      } else {
        callback(
          new Error(
            "Job did not complete successfully. Additional diagnostics:" +
            JSON.stringify(data, null, 1)
          )
        );
      }
    }
  });
}

/**
 * Submits multiple simple commands
 * @param {commandObject[]}  commands Array of commandObjects
 * @param {awaitJobCallback} callback function to call after completion
 */
function submitMultipleSimpleCommands(commands, callback) {
  if (commands.length > 0) {
    simpleCommand(commands[0].command, commands[0].dir, function (err) {
      if (err) {
        callback(err);
      } else {
        commands.shift();
        submitMultipleSimpleCommands(commands, callback);
      }
    });
  } else {
    callback();
  }
}

/**
 * Runs command and calls back without error if successful
 * @param {string}           data            command to run
 * @param {Array}            expectedOutputs array of expected strings to be in the output
 * @param {awaitJobCallback} callback        function to call after completion
 */
function verifyOutput(data, expectedOutputs, callback) {
  expectedOutputs.forEach(function (output) {
    if (!data.includes(output)) {
      callback(new Error(output + " not found in response: " + data));
    }
  });
  // Success
  callback();
}

/**
 * Writes content to files
 * @param {string}           dir     directory to write content to
 * @param {string}           content content to write
 */
function writeToFile(dir, content) {
  var d = new Date(),
    filePath = dir + "/" + d.toISOString() + ".txt";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}
