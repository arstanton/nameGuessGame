'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
	return gulp.src('./assets/css/**/*.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(gulp.dest('./public/css'));
});
 
gulp.task('sass:watch', function () {
	gulp.watch('./assets/css/**/*.scss', ['sass']);
});