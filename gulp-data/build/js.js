var gulp = require('gulp'),
    concat = require('gulp-concat')
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    argv = require('yargs').default('env', 'local').argv;

var jsVendors = {
  toastr: "node_modules/toastr/build/toastr.min.js",
  bootstrap: "node_modules/bootstrap-sass/assets/javascripts/bootstrap.js"
}

gulp.task('build:js', function(){
  return gulp.src(['./src/js/*.{coffee,js}', jsVendors.toastr, jsVendors.bootstrap])
    .pipe(concat("gpozzo.js"))
    .pipe(gulpif(argv.env === "prod", uglify()))
    .pipe(gulp.dest('./dist/js/'));
});
