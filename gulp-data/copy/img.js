var gulp = require('gulp'),
  gulpif = require('gulp-if'),
  imagemin = require('gulp-imagemin'),
  argv = require('yargs')
        .default('cliente', 'default')
        .default('env', 'local')
        .argv;

gulp.task('copy:img', function() {
  return gulp.src(['./src/assets/img/**', './builds/' + argv.cliente + '/img/**'])
    .pipe(gulpif(argv.env === "prod" || argv.env === "stg", imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }]
    })))
    .pipe(gulp.dest('./dist/img/'));
});
