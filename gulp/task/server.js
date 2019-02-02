var gulp = require('gulp');
var browserSync = require('browser-sync').create();
global.browserSync = browserSync
var proxy = require('http-proxy-middleware')
const userConfig = require('../../user.config')

let proxyMiddleware = userConfig.proxyConfig.map(item=>{
    return proxy(item.path,item.config)
})

gulp.task('server', function () {

    browserSync.init({
        server: "./dev",
        port: userConfig.port,
        middleware: proxyMiddleware
    });

});
