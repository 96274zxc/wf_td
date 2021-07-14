// 引用express框架
const express = require('express');
const { Sale } = require('../model/sale');
const { Mod } = require('../model/mod');

// 创建网站主页路由
const index = express.Router();
index.get('/', async(req, res) => {
    // 指定查询参数
    let query = req.query.query;
    var str = ".*" + query + ".*$"
    var reg = new RegExp(str);
    // 接收客户端传递过来的当前页参数
    let page = parseInt(req.query.pagenum);
    // 每一页显示的数据条数
    let pagesize = parseInt(req.query.pagesize);
    // 查询用户数据的总数
    let count = await Sale.countDocuments({});
    // 总页数
    let total = Math.ceil(count / pagesize);
    // 页码对应的数据查询开始位置
    let start = (page - 1) * pagesize;
    // 将商品信息从数据库中查询出来
    if (query == '') {
        var sale = await Sale.find({}).sort({ "_id": '-1' }).populate('sale').populate('seller').limit(pagesize).skip(start);
    } else {
        var mod = await Mod.find({ "mod": { $regex: reg, $options: 'i' } });
        // console.log(mod);
        var arr = [];
        mod.forEach(function(val, index) {
            // console.log('val:' + val._id);
            // console.log("index:" + index);
            arr.push(val._id);
        });
        var sale = await Sale.find({ "sale": { "$in": arr } }).sort({ "_id": '-1' }).populate('sale').populate('seller').limit(pagesize).skip(start);
        count = await Sale.countDocuments({ "sale": { "$in": arr } });
    }
    // 返回数据
    res.send({
        sale: sale,
        pagenum: page,
        total: count,
        meta: {
            "msg": "获取成功",
            "status": 200
        }
    });
});

// 将路由对象作为模块成员进行导出
module.exports = index;