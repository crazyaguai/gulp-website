import '@babel/polyfill'
const moduleA = require('./moduleA')
window.onload = function () {
    $('#myDiv').html('3456')
    moduleA.a()
    $.ajax({
        type: 'get',
        url: '/exchangeApi/sto/rates',
        data: {
            assetCode: 'USDT'
        },
        success: function (res) {
            console.log(res)
        },
    });
}
