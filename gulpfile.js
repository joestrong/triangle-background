var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
    return browserify('main.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('javascripts'));
});
