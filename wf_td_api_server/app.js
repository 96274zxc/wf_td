// 引用express框架
const express = require('express');
// 处理路径
const path = require('path');
// 引入body-parser模块 用来处理post请求参数
const bodyParser = require('body-parser');
const multer = require('multer'); //解析Post文件
const fs = require('fs');
// 导入express-session模块
const session = require('express-session');
// 导入morgan第三方模块
const morgan = require('morgan');
// 导入config模块
const config = require('config');
// 处理文件上传
// const formidableMiddleware = require('express-formidable');
// 创建网站服务器
const app = express();
// 数据库连接
require('./model/connect');
// 处理post请求参数
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var objMulter = multer({ dest: './public/uploads' }); //用户上传文件存入dest目录下
app.use(objMulter.any()); //处理任何用户上传的文件
// 开放静态资源文件
app.use(express.static(path.join(__dirname, 'public')));
// 处理post参数
// app.use(formidableMiddleware({
//     // 文件上传目录
//     uploadDir: path.join(__dirname, 'public', 'uploads'),
//     // 最大上传文件为2M
//     maxFileSize: 2 * 1024 * 1024,
//     // 保留文件扩展名
//     keepExtensions: true
// }));
console.log(config.get('title'));
// 获取系统环境变量 返回值是对象
if (process.env.NODE_ENV == 'development') {
    // 当前是开发环境
    console.log('当前是开发环境');
} else {
    // 当前是生产环境
    console.log('当前是生产环境');
}
// 设置跨域和相应数据格式
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    if (req.method == 'OPTIONS') res.send(200)
        /*让options请求快速返回*/
    else next()
});
// 引入路由模块
const index = require('./route/index');
const admin = require('./route/admin');
// 拦截请求 判断用户登录状态
// app.use('/admin', require('./middleware/loginGuard'));
// 为路由匹配请求路径
app.use('/index', index);
app.use('/admin', admin);
// 监听端口
app.listen(80);
console.log('网站服务器启动成功，请访问localhost');