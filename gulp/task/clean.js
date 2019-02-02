import gulp from 'gulp';
import gulpClean from 'gulp-clean';

gulp.task('clean:prod',function () {
    return gulp.src('./dist', {read: false,allowEmpty: true})
        .pipe(gulpClean());
})

gulp.task('clean:dev',function () {
    return gulp.src('./dev', {read: false,allowEmpty: true})
        .pipe(gulpClean());
})

gulp.task('clean',gulp.parallel('clean:prod','clean:dev'))
