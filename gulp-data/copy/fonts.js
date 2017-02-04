var gulp = require('gulp'),
  gulpif = require('gulp-if'),
  argv = require('yargs').default('cliente', 'default').argv,
  templateData = require('../../builds/' + argv.cliente + '/build.json');

gulp.task('copy:fonts', function() {
  gulp.src('./src/assets/fonts/**')
    .pipe(gulp.dest('./dist/fonts/'))
    .pipe(gulpif(templateData.caracteristicas.panel_admin.usar, gulp.dest('./dist/admin/fonts/')));
});
