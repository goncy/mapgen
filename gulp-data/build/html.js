var gulp = require('gulp'),
    argv = require('yargs').default('env', 'local').argv,
    gulpif = require('gulp-if'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    argv = require('yargs').default('cliente', 'default').argv,
    minifyHTML = require('gulp-htmlmin'),
    templateData = require('../../builds/' + argv.cliente + '/build.json');

gulp.task('build:html', function(){
  return gulp.src('./src/*.{html,nunjucks}')
    .pipe(data(templateData))
    .pipe(nunjucksRender())
    .pipe(gulpif(argv.env === "prod", minifyHTML()))
    .pipe(gulp.dest('./dist/'));
});
