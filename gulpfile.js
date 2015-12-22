var gulp            = require('gulp'),
    requireDir      = require('require-dir'),
    tasks           = requireDir('./gulp-data', {recurse: true}),
    runSequence     = require('run-sequence');

//Default
gulp.task('default', ["build"]);

//Clean
gulp.task('clean', ["clean:css", "clean:js", "clean:img"]);

//Copy
gulp.task('copy', function(cb){
  runSequence(
    "clean",
    ["copy:fonts", "copy:img", "copy:server"],
    cb);
});

//Build
gulp.task('build', function(cb){
  runSequence(
    ["clean", "copy"],
    ["build:html", "build:css", "build:js"],
    cb);
});

//Watch
gulp.task('watch', function () {
  gulp.watch(['src/*.html'], ['build:html']);
  gulp.watch(['src/**/*.{css,scss}', 'node_modules/**/*.{css,scss}'], ['build:css']);
  gulp.watch(['src/js/**/*.js'], ['build:js']);
});
