var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    addsrc = require('gulp-add-src'),
    nunjucksRender = require('gulp-nunjucks-render'),
    _ = require('lodash'),
    data = require('gulp-data'),
    debug = require('gulp-debug'),
    argv = require('yargs')
        .default('cliente', 'default')
        .default('env', 'local')
        .argv,
    templateData = require('../../builds/' + argv.cliente + '/build.json');

    var jsVendors = {
        toastr: "node_modules/toastr/build/toastr.min.js",
        bootstrap: "node_modules/bootstrap-sass/assets/javascripts/bootstrap.js",
        jspdf: "node_modules/jspdf/dist/jspdf.min.js"
    }

gulp.task('build:js', function() {
    if (templateData.admin.panel) {
        var adminTemplateData = _.cloneDeep(templateData);
        _.assignIn(adminTemplateData.extras, adminTemplateData.admin.extras);
        gulp.src(['./src/js/*.{coffee,js}', jsVendors.toastr, jsVendors.bootstrap])
            .pipe(gulpif(adminTemplateData.extras.filtrable.exportar, addsrc(jsVendors.jspdf)))
            .pipe(data(adminTemplateData))
            .pipe(nunjucksRender())
            .pipe(concat("gpozzo.js"))
            .pipe(gulpif(argv.env === "prod", uglify()))
            .pipe(gulp.dest('./dist/admin/js/'))
    }

    return gulp.src(['./src/js/*.{coffee,js}', jsVendors.toastr, jsVendors.bootstrap])
        .pipe(gulpif(templateData.extras.filtrable.exportar, addsrc(jsVendors.jspdf)))
        .pipe(data(templateData))
        .pipe(nunjucksRender())
        .pipe(concat("gpozzo.js"))
        .pipe(gulpif(argv.env === "prod", uglify()))
        .pipe(gulp.dest('./dist/js/'))
});