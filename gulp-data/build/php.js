var gulp = require('gulp'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    concat = require('gulp-concat'),
    argv = require('yargs').default('cliente', 'default').argv,
    templateData = require('../../builds/' + argv.cliente + '/build.json');

gulp.task('build:php', function(){
  return gulp.src(['./src/php/**.php'])
    .pipe(data(templateData))
    .pipe(nunjucksRender({ext: '.php'}))
    .pipe(gulp.dest('./dist/php/'));
});
