// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/jsonTest', function(req, res) {
    //res.render('hello', { message: 'Congrats, you just set up your app!' });
    var ip = req.headers['x-real-ip'];//获取ip地址
    res.json({'users': '小明','age':25,'ipAddress':ip});
});

var upload = require('upload');


// 路由映射
app.use('/upload', upload);


// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();