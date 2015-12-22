var gulp = require('gulp'),
    imagemin = require('gulp-imagemin');

gulp.task('copy:img', function() {
  return gulp.src('./src/assets/img/**')
    /*.pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))*/
    .pipe(gulp.dest('./dist/img/'));
});

//Comprimir solo en prod
