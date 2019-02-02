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

let entries = [
    {
        name: 'index',
        entry: ['src/js/index.js']
    }
]

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

function bundle(name,entry){
    let b = makeBundle(name,entry)
    return b
        .bundle()
        .pipe(source(`${name}.js`))
        .pipe(buffer())
        .pipe(replace('@img', 'img'))
        .pipe(gulp.dest('dev/js'))
        .pipe(gulpif(devServer,global.browserSync.reload({stream: true})))
}

function devFun(name,entry) {

    devServer = true

    let b = makeBundle(name,entry)

    b.plugin(watchify);

    b.on('update',bundle.bind(null,name,entry))

    return bundle(name,entry)
}

let prodArrFun = entries.map(i=>{
    return bundle.bind(null,i.name,i.entry)
})

gulp.task('js',gulp.parallel(prodArrFun))

let devArrFun = entries.map(i=>{
    return devFun.bind(null,i.name,i.entry)
})

gulp.task('js:dev',gulp.parallel(devArrFun))

gulp.task('js:dev2dist',function () {
    return gulp.src('dev/js/*.js')
        .pipe(uglify())
        .pipe(md5(6, './dist/*.html'))
        .pipe(gulp.dest('dist/js'))
})

gulp.task('js:prod',gulp.series('js','js:dev2dist'))

