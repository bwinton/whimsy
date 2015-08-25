#gulp-config-sync

[![GitHub version](https://badge.fury.io/gh/danlevan%2Fgulp-config-sync.svg)](http://badge.fury.io/gh/danlevan%2Fgulp-config-sync) [![NPM version](https://badge.fury.io/js/gulp-config-sync.svg)](http://badge.fury.io/js/gulp-config-sync) [![Build Status](https://travis-ci.org/danlevan/gulp-config-sync.svg?branch=master)](https://travis-ci.org/danlevan/gulp-config-sync)

> Synchronize version, name, description, keywords... in each config file (package.json, bower.json, component.js...).

By default, package.json is used as the source of truth but you can specify any source and any fields you want to synchronize.

Only the fields specified are synchronized. The other fields are left untouched.

## Gulp

This is a plugin for [gulp 3](http://gulpjs.com/).


## Usage

Install `gulp-config-sync` as a development dependency

```sh
$ npm install gulp-config-sync --save-dev
```

In your `gulpfile.js`

```javascript
// import plugin
var sync = require('gulp-config-sync');

gulp.task('sync', function() {
  gulp.src(['bower.json', 'component.json'])
    .pipe(sync())
    .pipe(gulp.dest('.')); // write it to the same dir
});
```

You can run the new task in the termininal
```sh
$ gulp sync
```

Or add it to existing tasks

```javascript
gulp.task('default', ['sync']);
```

## Options

- `src`
  - Default `package.json`
  - The path to the source.json file

- `fields`
  - Default `[
    'name',
    'version',
    'description',
    'keywords',
    'repository',
    {from: 'contributors', to: 'authors'}
  ]`
  - Specifies the fields to be synchronized

- `space`
  - Default (2 whitespaces)
  - Used for prettyprinting the result. See [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

### Example

```javascript
var options = {
  src: 'source.json',
  fields: [
    'name',
    'version',
    'description',
    {
      from: 'contributors',
      to: 'authors',
    },
  ],
  space: '    ',
};

gulp.src('bower.json')
  .pipe(sync(options))
  .pipe(gulp.dest(''));
```

## LICENSE
[MIT](LICENSE)
