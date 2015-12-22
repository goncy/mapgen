var gulp = require('gulp');

gulp.task('copy:fonts', function(){
  gulp.src('./src/assets/font/**')
    .pipe(gulp.dest('./dist/font/'));
});
