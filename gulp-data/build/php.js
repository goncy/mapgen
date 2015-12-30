var gulp = require('gulp'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    concat = require('gulp-concat'),
    projectData = require('../../build.json');

gulp.task('build:php', function(){
  return gulp.src(['./src/php/**.php'])
    .pipe(data(projectData))
    .pipe(nunjucksRender())
    .pipe(concat('dataHandler.php'))
    .pipe(gulp.dest('./dist/php/'));
});
