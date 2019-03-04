import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import md5 from 'gulp-md5-plus';

const srcArr = ['./src/imgs/*.{png,gif,jpg,jpeg}','./src/imgs/*/*.{png,gif,jpg,jpeg}']

function img(){
    return gulp
        .src(srcArr)
        .pipe(gulp.dest('./dev/imgs'))
}

gulp.task('img',img)

gulp.task('img:dev',function () {

    gulp.watch(srcArr, function (event) {
        return img(event.path)
            .pipe(global.browserSync.reload({stream: true}))
    });

    return img();
})

gulp.task('img:dev2dist',function () {
    return gulp
        .src(srcArr)
        .pipe(imagemin())//压缩图片
        .pipe(md5(6, ['./dist/*.html', './dist/css/*.css', './dist/js/*.js']))//添加hash，替换文件名
        .pipe(gulp.dest('./dist/imgs'))
})

gulp.task('img:prod',gulp.series('img','img:dev2dist'))
