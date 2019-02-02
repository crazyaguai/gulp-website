import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import webpcss from 'gulp-webpcss';
import md5 from 'gulp-md5-plus';
import gulpif from 'gulp-if';
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var replace = require('gulp-replace');

var devServer = false

function scss() {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(gulpif(devServer,sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(replace('../imgs', '../imgs'))
        .pipe(replace('../../imgs', '../imgs'))
        .pipe(gulpif(devServer,sourcemaps.write()))
        .pipe(gulp.dest('./dev/css'));
}

gulp.task('scss',scss)

gulp.task('scss:dev', function () {
    devServer = true
    gulp.watch(['./src/scss/*.scss','./src/scss/*/*.*'], function (event) {
        return scss().pipe(global.browserSync.reload({stream: true}));
    });
    return scss()
});

gulp.task('scss:dev2dist',function () {
    return gulp.src('./dev/css/*.css')
        .pipe(webpcss())
        .pipe(cleanCSS())
        .pipe(md5(6, './dist/*.html'))
        .pipe(gulp.dest('./dist/css'));
})

gulp.task('scss:prod', gulp.series('scss','scss:dev2dist'));
