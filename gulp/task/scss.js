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
        .src('./src/scss/*.scss')//查找入口文件
        .pipe(gulpif(devServer,sourcemaps.init()))//开发环境添加sourcemap配置
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))//添加浏览器前缀
        .pipe(replace('../imgs', '../imgs'))//处理图片路径
        .pipe(replace('../../imgs', '../imgs'))
        .pipe(gulpif(devServer,sourcemaps.write()))
        .pipe(gulp.dest('./dev/css'));//开发环境存放文件
}

gulp.task('scss',scss)

gulp.task('scss:dev', function () {
    devServer = true
    //开发环境监听文件变化重新打包并刷新浏览器
    gulp.watch(['./src/scss/*.scss','./src/scss/*/*.*'], function (event) {
        return scss().pipe(global.browserSync.reload({stream: true}));
    });
    return scss()
});

gulp.task('scss:dev2dist',function () {
    return gulp.src('./dev/css/*.css')
        .pipe(webpcss())//处理webp文件
        .pipe(cleanCSS())//压缩文件
        .pipe(md5(6, './dist/*.html'))//添加hash，并替换html中的文件名称
        .pipe(gulp.dest('./dist/css'));//生产环境保存文件
})

gulp.task('scss:prod', gulp.series('scss','scss:dev2dist'));
