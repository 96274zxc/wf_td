const { Sale } = require('../../model/sale');
const { Mod } = require('../../model/mod');

module.exports = async(req, res) => {
    // console.log(req.role);
    // console.log(req.user_id);
    // 指定查询参数
    let query = req.query.query;
    var str = ".*" + query + ".*$"
    var reg = new RegExp(str);
    // 接收客户端传递过来的当前页参数
    let page = parseInt(req.query.pagenum);
    // 每一页显示的数据条数
    let pagesize = parseInt(req.query.pagesize);
    // 查询用户数据的总数
    let count = await Sale.countDocuments({ "seller": req.user_id });
    // 总页数
    let total = Math.ceil(count / pagesize);
    // 页码对应的数据查询开始位置
    let start = (page - 1) * pagesize;
    // 将商品信息从数据库中查询出来
    if (query == '') {
        var sale = await Sale.find({ "seller": req.user_id }).populate('sale').limit(pagesize).skip(start);
    } else {
        var mod = await Mod.find({ "mod": { $regex: reg, $options: 'i' } });
        var arr = [];
        mod.forEach(function(val, index) {
            console.log('val:' + val._id);
            console.log("index:" + index);
            arr.push(val._id);
        });
        // console.log(arr);
        var sale = await Sale.find({ "seller": req.user_id, "sale": { "$in": arr } }).populate('sale').limit(pagesize).skip(start);
        count = await Sale.countDocuments({ "seller": req.user_id, "sale": { "$in": arr } });
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
}