# gulp-help-four
> Temporary gulp help module for gulp 4.0 while task descriptions and 4.0 are still pending
> Adds a default help task to gulp and provides the ability to add custom help messages to your gulp tasks

This is basically a quick rewrite of gulp-help to support the unreleased gulp 4.0 branch

Differences:
* Order of arguments are different
* Works with the new gulp 4.0 task api
* Aliases are treated as completely separate tasks due to the quick rewrite
* help options are slightly modified
* Added hideEmpty option to hide empty descriptions or show them

While I updated the docs and created unit tests for this it is possible I missed something,
I did put this together pretty quickly.
I'll be glad to look into any bugs or answer any questions but I suspect that once 4.0 is
officially released gulp-help will be updated to work with the new task format.

Code cleanup is also welcome :)

## Install

```bash
$ npm install --save-dev gulp-help-four
```

## Usage

Before defining any tasks, add `gulp-help-four` to your gulp instance

```js
// gulpfile.js
var gulp = require('gulp');
var help = require('gulp-help-four');
help(gulp, opts);
```

Available options are:
* description - The default description for the help message
* hideEmpty - Boolean whether to hide tasks with empty descriptions
* aliases - Array of aliases for the help command
* cb - Function to call after the help output has been rendered 

Next, define help text for each custom task

```js
// gulpfile.js
gulp.task('lint', 'Lints all server side js', function () {
    gulp.src('./lib/**/*.js')
      .pipe(jshint());
});
```

Now show that help via `gulp help`

```bash
$ gulp help
[gulp] Running 'help'...

Usage: gulp [task]

Available tasks
  help Display this help text.
  lint Lints all server side js

[gulp] Finished 'help' in 607 μs
```

## New task API

### gulp.task(name[, help, aliases, opts], fn)

#### name

Type: `string`

#### help

Type: `string | boolean`

Custom help message as a string.
If you want to hide the task from the help menu, supply `false`.

```js
gulp.task('task-hidden-from-help', false, function () {
  // ...
});
```

#### fn

Type: `function`

The task function
If this is an anonymous function you must include a name

#### aliases

Type: `Array`

List of aliases for this task.


```js
gulp.task('version', 'prints the version.', ['v', 'V'], function() {
  // ...
});
```

which results in

```bash
[gulp] Starting 'help'...

Usage
  gulp [task]

Available tasks
  help     Display this help text.
  version  prints the version.
  v        prints the version.
  V        prints the version.

[gulp] Finished 'help' after 928 μs
```

## Options

You can optionally pass options to your targets by supplying an options object, e.g.

```js
gulp.task('version', 'prints the version.', {
  'env=prod': 'description of env, perhaps with available values',
  'key=val': 'description of key & val',
  'key': 'description of key'
}, function () {
  // ...
});
```
which results in

```bash
[gulp] Starting 'help'...

Usage
  gulp [task]

Available tasks
  help          Display this help text.
  version       prints the version.
    --env=prod  description of env, perhaps with available values
    --key=val   description of key & val
    --key       description of key

[gulp] Finished 'help' after 928 μs
```

## Override default help message

```js
require('gulp-help')(gulp, { description: 'you are looking at it.', aliases: ['h', '?'] });
```

Then, calling

```shell
$ gulp      #or
$ gulp help #or
$ gulp h    #or
$ gulp ?
```

will now result in

```
[gulp] Starting 'help'...

Usage:
  gulp [task]

Available tasks:
  help     you are looking at it.
  h        you are looking at it.
  ?        you are looking at it.

[gulp] Finished 'help' after 1.05 ms
```

## Post-help callback

You can define a function to run after the default help task runs.

```js
require('gulp-help')(gulp, {
  cb: function(done) {
    var tasks = gulp.registry().tasks();
    console.log(tasks);
    done();
  }
});
```

## License

[MIT](http://opensource.org/licenses/MIT)
