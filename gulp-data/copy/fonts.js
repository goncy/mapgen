var gulp = require('gulp');

gulp.task('copy:fonts', function() {
  gulp.src('./src/assets/fonts/**')
    .pipe(gulp.dest('./dist/fonts/'));
});
