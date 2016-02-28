var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    debug = require('gulp-debug'),
    argv = require('yargs')
        .default('cliente', 'default')
        .default('env', 'local')
        .argv,
    templateData = require('../../builds/' + argv.cliente + '/build.json');

    var jsVendors = {
        toastr: "node_modules/toastr/build/toastr.min.js",
        bootstrap: "node_modules/bootstrap-sass/assets/javascripts/bootstrap.js"
    }

gulp.task('build:js', function() {
    return gulp.src(['./src/js/*.{coffee,js}', jsVendors.toastr, jsVendors.bootstrap])
        .pipe(data(templateData))
        .pipe(nunjucksRender())
        .pipe(concat("gpozzo.js"))
        .pipe(gulpif(argv.env === "prod", uglify()))
        .pipe(gulp.dest('./dist/js/'))
});