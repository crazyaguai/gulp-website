import gulp from 'gulp';

gulp.task('favicon:dev', function () {
    return gulp.src('./favicon.ico')
        .pipe(gulp.dest('./dev'));
});

gulp.task('favicon:dist', function () {
    return gulp.src('./favicon.ico')
        .pipe(gulp.dest('./dist'));
});

gulp.task('static:dev',function () {
    const files = './src/static/*';

    function todo(path = files) {
        return gulp.src(path)
            .pipe(gulp.dest('dev/static'))
            .pipe(global.browserSync.reload({stream: true}))
    }

    gulp.watch('./src/static/*',function (event) {
        let path = event.path;
        return todo(path);
    })

    return todo()
})

gulp.task('static:prod',function () {
    return gulp.src('./src/static/*')
        .pipe(gulp.dest('dist/static'))
})
