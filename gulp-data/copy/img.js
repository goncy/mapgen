var gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  debug = require('gulp-debug'),
  imageResize = require('gulp-image-resize'),
  argv = require('yargs').default('cliente', 'default').argv,
  gulpif = require('gulp-if'),
  templateData = require('../../builds/' + argv.cliente + '/build.json');

gulp.task('copy:img', function() {
  return gulp.src(['./src/assets/img/**', './builds/' + argv.cliente + '/img/**'])
    .pipe(gulpif(argv.env === "prod" || argv.env === "stg", imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }]
    })))
    .pipe(gulp.dest('./dist/img/'))
    .pipe(gulpif(templateData.admin.panel, gulp.dest('./dist/admin/img/')));
});
