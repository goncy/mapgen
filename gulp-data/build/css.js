var gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  minifyCss = require('gulp-minify-css'),
  gulpif = require('gulp-if'),
  argv = require('yargs')
  .default('env', 'local')
  .argv;

var cssVendors = {
  toastr: "node_modules/toastr/toastr.scss",
  bootstrap: "node_modules/bootstrap-sass/assets/stylesheets/bootstrap.scss"
}

gulp.task('build:css', function() {
  return gulp.src(['./src/{sass,css}/**/*.{scss,css}', cssVendors.toastr, cssVendors.bootstrap])
    .pipe(sass())
    .pipe(concat('gpozzo.css'))
    .pipe(gulpif(argv.env === "prod", minifyCss()))
    .pipe(gulp.dest('./dist/css/'));
});
