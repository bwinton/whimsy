'use strict';

/* Modules. */

var gulp = require('gulp');
var merge = require('merge-stream');
var sync = require('gulp-config-sync');
// var zip = require('gulp-zip');


/* Variables */

var sourceFiles = [];


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
    // .pipe(zip('borderify.xpi'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['other']);
