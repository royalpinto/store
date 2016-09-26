var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var less = require('gulp-less');

var env = 'prod';
var _env = process.argv[process.argv.length - 1];
if (_env && _env.startsWith('--')) {
    env = _env.substring(2);
}

console.log(env);


gulp.task('minifijs', function(cb) {
    var queue = [
        gulp.src([
            'public/js/**/*.js',
            '!public/js/dist/*.js',
        ]),
        concat('all.js'),
    ];

    // On development env compression is not applied for easy debug.
    if (env !== 'development') {
        queue.push(uglify());
    }

    queue.push(gulp.dest('public/js/dist/'));

    pump(queue, cb);
});


gulp.task('less2css', function(cb) {
    pump([
        gulp.src([
            'public/css/*.less',
        ]),
        concat('all.less'),
        less(),
        gulp.dest('public/css/dist/'),
    ], cb);
});


gulp.task('default', [
    'minifijs',
    'less2css',
]);
