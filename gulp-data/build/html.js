var gulp = require('gulp'),
    argv = require('yargs').default('env', 'local').argv,
    gulpif = require('gulp-if'),
    minifyHTML = require('gulp-minify-html');

gulp.task('build:html', function(){
  return gulp.src('./src/*.{html,nunjucks}')
    .pipe(gulpif(argv.env === "prod", minifyHTML()))
    .pipe(gulp.dest('./dist/'));
});
