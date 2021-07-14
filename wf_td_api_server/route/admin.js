// 引用express框架
const express = require('express');
// 创建用户页面路由
const admin = express.Router();
admin.use('/', require('../middleware/loginGuard'));
admin.post('/login', require('./admin/login'));
admin.post('/register', require('./admin/register'));
admin.get('/getusername', require('./admin/getusername'));
admin.post('/upload', require('./admin/upload'));
admin.post('/avater', require('./admin/avater-add'));
admin.get('/getavater', require('./admin/getavater'));
// 拦截非管理员请求
admin.use('/user', require('../middleware/newLoginGuard'));
admin.get('/user', require('./admin/user'));
admin.put('/user/:email/state/:type', require('./admin/user-state'));
// 拦截非管理员请求
admin.use('/mod', require('../middleware/newLoginGuard'));
admin.get('/mod', require('./admin/mod'));
admin.post('/mod', require('./admin/mod-add'));
admin.get('/mod/:mod', require('./admin/mod-get'));
admin.put('/mod/:_id', require('./admin/mod-edit'));
admin.delete('/mod/:_id', require('./admin/mod-delete'));
// 拦截非管理员请求
admin.use('/sale', require('../middleware/saleGuard'));
admin.get('/sale', require('./admin/sale'));
admin.post('/sale', require('./admin/sale-add'));
admin.get('/sale/:sale', require('./admin/sale-get'));
admin.get('/sale/modname/:modId', require('./admin/sale-get-getmodname'));
admin.put('/sale/:_id', require('./admin/sale-edit'));
admin.delete('/sale/:_id', require('./admin/sale-delete'));
admin.get('/comment', require('./admin/comment'));
admin.post('/comment', require('./admin/comment-add'));
// 将路由对象作为模块成员进行导出
module.exports = admin;