import gulp from 'gulp';

gulp.task('prod',
    gulp.series(
        'clean',
        'html:prod',
        gulp.parallel('scss:prod', 'js:prod', 'static:prod', 'favicon:dist'),
        'img:prod'
    ))
