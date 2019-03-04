import gulp from 'gulp';
import replace from 'gulp-replace';
const htmlmin = require('gulp-htmlmin');
var handleError = require('../util/handleError')
var fs = require('fs')
var data = require('gulp-data')
var ejs = require('gulp-ejs')
var rename = require("gulp-rename");

//html入口文件
let htmlConfig = [
    {
        entry: 'src/html/index.html',
        name: 'index.html',//打包后文件名
        lang: 'zh-cn'//ejs语言配置文件，对应/src/lang下的json文件
    },
    {
        entry: 'src/html/index.html',
        name: 'index-en.html',
        lang: 'en'
    },
]

//处理ejs模板
function html(config){
    return gulp
        .src(config.entry)
        .pipe(data(function(file) {//加载语言配置
            return JSON.parse(fs.readFileSync(`src/lang/${config.lang}.json`))
        }))
        .pipe(replace('../imgs', './imgs'))//替换图片路径
        .pipe(replace('../../imgs', './imgs'))
        .pipe(ejs().on('error', handleError))//错误处理
        .pipe(rename(config.name))//替换文件名
        .pipe(gulp.dest('dev'))
}

let htmlDevArr = htmlConfig.map(config=>{
    return function (config) {
        //监听变化重新打包并且刷新浏览器
        gulp.watch([config.entry,'src/html/*/*.*','src/lang/*'], function (event) {
            return html(config).pipe(global.browserSync.reload({stream: true}));
        });
        return html(config)
    }.bind(null,config)
})

//开发环境命令
gulp.task('html:dev',gulp.parallel(htmlDevArr))

gulp.task('html:dev2dist',function () {
    return gulp
        .src('dev/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))//压缩html
        .pipe(gulp.dest('dist'))
})

let htmlProdArr = htmlConfig.map(config=>{
    return function (config) {
        return html(config)
    }.bind(null,config)
})
//生产环境命令
gulp.task('html:prod',gulp.series(gulp.parallel(htmlProdArr),'html:dev2dist'))
