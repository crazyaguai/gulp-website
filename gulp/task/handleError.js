//错误处理

const notify = require("gulp-notify");
module.exports = function(){
    var args = Array.prototype.slice.call(arguments)

    notify.onError({
        title: 'compile error',
        message: '<%=error.message %>'
    }).apply(this, args)

    this.emit();
}
