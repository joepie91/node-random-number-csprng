var gulp = require('gulp');

var gutil = require('gulp-util');
var babel = require('gulp-babel');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var plumber = require('gulp-plumber');

var source = ["src/**/*.js"]

gulp.task('babel', function () {
  return gulp.src(source)
    .pipe(plumber())
    .pipe(cache("babel"))
    .pipe(babel({
      presets: ["@babel/preset-env"],
      plugins: ["@babel/plugin-proposal-class-properties"]
    }).on('error', gutil.log)).on('data', gutil.log)
    .pipe(remember("babel"))
    .pipe(gulp.dest("lib/"));
});

gulp.task('watch', function() {
  gulp.watch(source, gulp.series('babel'));
});

gulp.task('default', gulp.series(['babel', 'watch']));