var gulp = require('gulp');

gulp.task('copy:server', function(){
  gulp.src('./src/php/**')
    .pipe(gulp.dest('./dist/php/'));
});
