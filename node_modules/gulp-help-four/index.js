'use strict';

var Table = require('cli-table');
var chalk = require('chalk');

var oldTaskFunction = null;
var hideEmpty = false;
var description = false;
var aliases = [];
var cb = null;
var gulpRef = null;

/**
 * New gulp.task function
 *
 * @param {string} name - The name of the task
 * @param {string} description - The description of the task
 * @param {Array} aliases - An array of aliases for the task
 * @param {Object} opts - Command line options for the task
 * @param {Function} fn - The task function
 */
var newTaskFunction = function task(name, description, aliases, opts, fn) {
  var args = Array.prototype.slice.call(arguments);
  fn = args.pop();
  aliases = [];
  name = '';
  var title = false;
  opts = false;

  // if we don't have a task let gulp deal with it so we don't break anything
  if (args.length === 0 && typeof fn !== 'function') {
    return oldTaskFunction(fn);
  }

  if (typeof fn !== 'function') {
    throw new Error('You must supply a function');
  }

  // see if we have opts (must be an object but not an array)
  var potentialOpts = args[args.length - 1];
  if (typeof potentialOpts === 'object' && !(potentialOpts instanceof Array)) {
    opts = args.pop();
  }

  // see if we have aliases
  if ((args[args.length - 1]) instanceof Array) {
    aliases = args.pop();
  }

  // get the name defaulting to the name of the function
  if (args.length) {
    name = args.shift();
  } else {
    name = fn.name;
  }

  // get the title defaulting to false
  if (args.length) {
    title = args.shift();
  } else {
    title = false;
  }

  // set the needed variables on the function
  fn.description = title;
  if (opts) {
    fn.opts = opts;
  }

  // ensure that name is set as it's required by gulp
  if (!name) {
    throw new Error('Anonymous functions must have a task name');
  }

  // call the original function to setup the task
  oldTaskFunction.call(gulpRef, name, fn);

  // setup the task for any aliases
  aliases.forEach(function(alias) {
    oldTaskFunction.call(gulpRef, alias, fn);
  });
};

/**
 * Help task
 *
 * @param {Function} done - callback function
 */
var gulpHelpTask = function helpTask(done) {
  var tasks = gulpRef.registry().tasks();
  var taskNames = Object.keys(tasks);
  taskNames = taskNames.sort(function(a, b) {
    return a.localeCompare(b);
  });

  console.log('Usage: gulp [task]');
  console.log('');
  console.log('Available Tasks');

  var table = new Table({
    chars: {
      'top': '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      'bottom': '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      'left': '',
      'left-mid': '',
      'mid': '',
      'mid-mid': '',
      'right': '',
      'right-mid': '',
      'middle': ' '
    }, style: {'padding-left': 2, 'padding-right': 2}
  });

  taskNames.forEach(function(taskName) {
    var task = gulpRef._registry.get(taskName).unwrap();
    var title = task.description;

    var margin = '';
    var additionalMargin = (taskName.match(/:/g) || []).length;
    var i = 0;
    while (i < additionalMargin) {
      margin += '  ';
      i++;
    }

    if (!title) {
      title = '';
    }

    if (title || !hideEmpty) {
      table.push([chalk.cyan(margin + taskName), title]);
    }

    margin += '  ';
    if (task.opts) {
      var opts = Object.keys(task.opts);
      opts.forEach(function(opt) {
        table.push([margin + opt, task.opts[opt]]);
      });
    }
  });

  console.log(table.toString());
  console.log('');

  if (cb) {
    cb(done);
  } else {
    done();
  }
};

/**
 * Sets up the help task and overrides the gulp.task method
 *
 * @description - Options takes four parameters:
 * description - The text for the help task
 * hideEmpty - Whether to hide tasks that don't have a description
 * aliases - An array of aliases for the task
 * cb - A post print method to call
 *
 * @param {Object} gulp - The instance of gulp to modify
 * @param {Object} options - The options for help
 */
var help = function help(gulp, options){
  if(!gulp) {
    throw new Error('You must pass the gulp instance to gulp help');
  }

  gulpRef = gulp;

  // store the original gulp task
  oldTaskFunction = gulp.task;

  // setup the default options if they're not passed in
  options = options || {};

  description = options.description || 'Display this help text.';
  hideEmpty = options.hideEmpty || false;
  aliases = options.aliases || [];
  aliases.unshift('default');
  cb = options.cb || false;

  // override the gulp task method
  gulp.task = newTaskFunction;

  // register the help task for help and it's aliases
  gulp.task('help', description, aliases, gulpHelpTask);
};

module.exports = help;
