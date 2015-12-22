var gulp  = require('gulp'),
    del   = require('del');

// CSS
gulp.task('clean:css', function() {
  return del('./dist/css/**');
});

// JS
gulp.task('clean:js', function() {
  return del('./dist/js/**');
});

// IMG
gulp.task('clean:img', function() {
  return del('./dist/img/**');
});
