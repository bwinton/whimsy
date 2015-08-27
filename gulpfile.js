'use strict';

/* Modules. */

var gulp = require('gulp');
var meta = require('./package.json');

// Gulp modules.
var babel = require('gulp-babel');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var sync = require('gulp-config-sync');
var zip = require('gulp-zip');


/* Variables */

var sourceFiles = ['lib/*'];
var imageFiles = ['images/*'];
var iconFiles = ['icon.png', 'icon64.png'];


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
  var es = gulp.src(sourceFiles);
  var js = gulp.src(sourceFiles)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write());
  var images = gulp.src(imageFiles, {'base': './'});
  var icons = gulp.src(iconFiles);

  // Firefox can handle ES6.
  merge(manifest, es, images, icons)
    .pipe(zip(meta.name + '.xpi'))
    .pipe(gulp.dest('dist/'));

  // Chrome needs a transpiler.
  merge(manifest, js, images, icons)
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['other']);
