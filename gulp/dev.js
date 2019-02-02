import gulp from 'gulp'

gulp.task('dev',
    gulp.series(
        'clean:dev',
        'html:dev',
        gulp.parallel('scss:dev', 'js:dev', 'static:dev', 'favicon:dev'),
        'img:dev',
        'server'
    ))
