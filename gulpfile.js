'use strict';

/* Modules. */

var gulp = require('gulp');
var merge = require('merge-stream');
var sync = require('gulp-config-sync');
var zip = require('gulp-zip');
var meta = require('./package.json');

/* Variables */

var sourceFiles = ['lib/*'];


/* Tasks. */

gulp.task('other', function() {
  var manifest = gulp.src('manifest.json')
    .pipe(sync({fields: [
      {'from': 'shortName', 'to': 'name'},
      'version',
      'description',
      'author',
      'contributors',
      {'from': 'homepage', 'to': 'homepage_url'}
    ]}));
  var js = gulp.src(sourceFiles);

  merge(manifest, js)
    .pipe(zip(meta.name + '.xpi'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['other']);
