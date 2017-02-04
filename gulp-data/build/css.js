var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-cssnano'),
    nunjucksRender = require('gulp-nunjucks-render'),
    _ = require('lodash'),
    data = require('gulp-data'),
    gulpif = require('gulp-if'),
    argv = require('yargs').default('cliente', 'default').argv,
    templateData = require('../../builds/' + argv.cliente + '/build.json');

var cssVendors = {
    toastr: "node_modules/toastr/toastr.scss",
    fontAwesome: "node_modules/font-awesome/css/font-awesome.css"
};

gulp.task('build:css', function() {
    if (templateData.caracteristicas.panel_admin.usar) {
        var adminTemplateData = _.cloneDeep(templateData);
        adminTemplateData.adminPass = true;
        _.assignIn(adminTemplateData.caracteristicas.usuario, adminTemplateData.caracteristicas.admin);
        gulp.src(['./src/{sass,css}/**.{scss,css}', cssVendors.toastr, cssVendors.fontAwesome])
            .pipe(data(adminTemplateData))
            .pipe(nunjucksRender({ ext: '.scss' }))
            .pipe(sass())
            .pipe(concat('gpozzo.css'))
            .pipe(gulpif(argv.env === "prod", minifyCss()))
            .pipe(gulp.dest('./dist/admin/css/'));
    }

    return gulp.src(['./src/{sass,css}/**.{scss,css}', cssVendors.toastr, cssVendors.fontAwesome])
        .pipe(data(templateData))
        .pipe(nunjucksRender({ ext: '.scss' }))
        .pipe(sass())
        .pipe(concat('gpozzo.css'))
        .pipe(gulpif(argv.env === "prod", minifyCss()))
        .pipe(gulp.dest('./dist/css/'));
});
