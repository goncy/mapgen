var gulp = require('gulp'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    _ = require('lodash'),
    concat = require('gulp-concat'),
    argv = require('yargs').default('cliente', 'default').argv,
    templateData = require('../../builds/' + argv.cliente + '/build.json');

gulp.task('build:php', function() {
    if (templateData.caracteristicas.panel_admin.usar) {
        var adminTemplateData = _.cloneDeep(templateData);
        adminTemplateData.adminPass = true;
        _.assignIn(adminTemplateData.caracteristicas.usuario, adminTemplateData.caracteristicas.admin);
        gulp.src('./src/php/**.php')
            .pipe(data(adminTemplateData))
            .pipe(nunjucksRender({ ext: '.php' }))
            .pipe(gulp.dest('./dist/admin/php/'));
        gulp.src('./src/admin/**.php')
            .pipe(data(adminTemplateData))
            .pipe(nunjucksRender({ ext: '.php' }))
            .pipe(gulp.dest('./dist/admin'))
    }

    return gulp.src(['./src/php/**.php'])
        .pipe(data(templateData))
        .pipe(nunjucksRender({ ext: '.php' }))
        .pipe(gulp.dest('./dist/php/'));
});
