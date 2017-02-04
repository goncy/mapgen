var gulp = require('gulp'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    concat = require('gulp-concat'),
    argv = require('yargs').default('cliente', 'default').argv,
    templateData = require('../../builds/' + argv.cliente + '/build.json');

gulp.task('build:db', function() {
    if (templateData.caracteristicas.panel_admin.usar) {
        return gulp.src('./src/full.sql')
            .pipe(data(templateData))
            .pipe(nunjucksRender({ ext: '.sql' }))
            .pipe(gulp.dest('./dist/'));
    } else {
        return gulp.src('./src/simple.sql')
            .pipe(gulp.dest('./dist/'));
    }
});
