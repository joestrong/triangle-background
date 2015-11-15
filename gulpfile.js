var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var scripts = [
    'src/helpers.js',
    'src/triangle.js',
    'src/triangle-node.js',
    'src/triangle-node-manager.js',
    'src/triangle-background.js'
];

gulp.task('dist', function() {
    return gulp.src(scripts)
	.pipe(concat('triangle-background.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist-min', function() {
    return gulp.src(scripts)
	.pipe(concat('triangle-background.min.js'))
	.pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['dist', 'dist-min']);

