import gulp from 'gulp';
import babel from "gulp-babel";
import uglify from 'gulp-uglify'
import md5 from 'gulp-md5-plus';
import concat from 'gulp-concat'
import babelify from 'babelify';
import watchify from 'watchify';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';

var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var html2js = require('html2js-browserify')
var replace = require('gulp-replace');
var pathmodify = require('pathmodify');
var aliasify = require('aliasify')
const path = require('path')

var devServer = false

var bundleArr = {}

//js入口文件
let entries = [
    {
        name: 'index',
        entry: ['src/js/index.js']
    }
]

//使用browserify和babel打包js文件
function makeBundle(name,entry){
    if(!bundleArr[name]){
        let b = browserify({
            entries: entry,
            debug: devServer,
            extensions: ['es6'],
        })
            .transform(html2js)
            .transform(babelify)
            .on('error', function (err) { console.error(err); })
        bundleArr[name] = b
    }
    return bundleArr[name]
}

//直接打包不检测更新
function bundle(name,entry){
    let b = makeBundle(name,entry)
    return b
        .bundle()
        .pipe(source(`${name}.js`))
        .pipe(buffer())
        .pipe(replace('@img', 'img'))
        .pipe(gulp.dest('dev/js'))
        .pipe(gulpif(devServer,global.browserSync.reload({stream: true})))//文件变化刷新浏览器
}

//开发环境打包
let devArrFun = entries.map(i=>{//循环入口，每个文件都打包
    return devFun.bind(null,i.name,i.entry)
})

//打包js并检测更新
function devFun(name,entry) {

    devServer = true

    let b = makeBundle(name,entry)

    b.plugin(watchify);

    //文件变化重新打包js
    b.on('update',bundle.bind(null,name,entry))

    return bundle(name,entry)
}

//生产环境打包
let prodArrFun = entries.map(i=>{
    return bundle.bind(null,i.name,i.entry)
})

gulp.task('js',gulp.parallel(prodArrFun))

//开发环境任务
gulp.task('js:dev',gulp.parallel(devArrFun))

//将dev中文件转入dist文件夹中
gulp.task('js:dev2dist',function () {
    return gulp.src('dev/js/*.js')
        .pipe(uglify())
        .pipe(md5(6, './dist/*.html'))
        .pipe(gulp.dest('dist/js'))
})
//生产环境任务
gulp.task('js:prod',gulp.series('js','js:dev2dist'))

