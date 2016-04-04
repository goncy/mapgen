var gulp = require('gulp'),
    argv = require('yargs').default('env', 'local').argv,
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    _ = require('lodash'),
    rename = require('gulp-rename'),
    argv = require('yargs').default('cliente', 'default').argv,
    minifyHTML = require('gulp-htmlmin'),
    templateData = require('../../builds/' + argv.cliente + '/build.json');

gulp.task('build:html', function() {
    if (templateData.admin.panel) {
        var adminTemplateData = _.cloneDeep(templateData);
        adminTemplateData.adminPass = true;
        _.assignIn(adminTemplateData.extras, adminTemplateData.admin.extras);
        gulp.src(['./src/admin/logged.php', './src/index.html'])
            .pipe(concat("index.php"))
            .pipe(data(adminTemplateData))
            .pipe(nunjucksRender({ ext: '.php' }))
            .pipe(gulp.dest('./dist/admin'));
    }

    return gulp.src('./src/*.{html,nunjucks}')
        .pipe(data(templateData))
        .pipe(nunjucksRender())
        .pipe(gulpif(argv.env === "prod", minifyHTML()))
        .pipe(gulp.dest('./dist/'));
});
