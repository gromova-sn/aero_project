'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');

var conf = {
	scssPath: './css/',
	cssPath: './css'
};
 
gulp.task('sass', function () {
  gulp.src(conf.scssPath + '*.scss')
    .pipe(sass({
    	outputStyle: 'compact'
    }).on('error', sass.logError))
    .pipe(gulp.dest(conf.cssPath));
});
 
gulp.task('sass:watch', function () {
  gulp.watch(conf.scssPath + '*.scss', ['sass']);
});
