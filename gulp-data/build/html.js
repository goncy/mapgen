var gulp = require('gulp'),
    argv = require('yargs').default('env', 'local').argv,
    gulpif = require('gulp-if'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    projectData = require('../../data/projectData.json'),
    minifyHTML = require('gulp-minify-html');

gulp.task('build:html', function(){
  return gulp.src('./src/*.{html,nunjucks}')
    .pipe(data(projectData))
    .pipe(nunjucksRender())
    .pipe(gulpif(argv.env === "prod", minifyHTML()))
    .pipe(gulp.dest('./dist/'));
});
