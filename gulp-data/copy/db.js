var gulp = require('gulp'),
  gulpif = require('gulp-if'),
  argv = require('yargs').default('cliente', 'default').argv,
  templateData = require('../../builds/' + argv.cliente + '/build.json');

var dbFile = templateData.admin.panel ? "./src/full.sql" : "./src/simple.sql";

gulp.task('copy:db', function() {
  gulp.src(dbFile)
    .pipe(gulp.dest('./dist/'))
});
