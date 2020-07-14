const gulp = require('gulp');
const babel = require('gulp-babel');

var source = ["src/**/*.js"]

gulp.task('babel', () => {
	return gulp.src(source)
		.pipe(babel(
			{
				presets: [
					[
						"@babel/preset-env", {
							useBuiltIns: false
						}
					]
				]
			}
		)) //.on('error', gutil.log)).on('data', gutil.log)
		.pipe(gulp.dest("lib/"));
});

gulp.task('watch', () => {
	gulp.watch(source, gulp.series('babel'));
});

gulp.task('default', gulp.series('babel'));
