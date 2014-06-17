'use strict';

var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var nib = require('nib');

var node_path = require('path');

gulp.task('stylus', function() {
  var stylusOptions = {
    use: [nib()],
    import: ["nib"]
  };
  gulp.src(["test/stylus/*.styl"])
    .pipe(stylus(stylusOptions))
    .pipe(gulp.dest('test/css/'));
});

gulp.task('jade', function() {
  gulp
    .src([
      "test/*.jade"
    ])
    .pipe(jade())
    .pipe(gulp.dest("test/"));
});

gulp.task('default', ['stylus', 'jade']);
