const { User } = require('../../model/user');

module.exports = async(req, res) => {
    // 指定查询参数
    let query = req.query.query;
    var str = ".*" + query + ".*$"
    var reg = new RegExp(str);
    // 接收客户端传递过来的当前页参数
    let page = parseInt(req.query.pagenum);
    // 每一页显示的数据条数
    let pagesize = parseInt(req.query.pagesize);
    // 查询用户数据的总数
    let count = await User.countDocuments({});
    // 总页数
    let total = Math.ceil(count / pagesize);
    // 页码对应的数据查询开始位置
    let start = (page - 1) * pagesize;
    // 将用户信息从数据库中查询出来
    if (query == '') {
        var user = await User.find({}).limit(pagesize).skip(start);
    } else {
        var user = await User.find({ "nickName": { $regex: reg, $options: 'i' } }).limit(pagesize).skip(start);
        count = await User.countDocuments({ "nickName": { $regex: reg, $options: 'i' } });

    }
    // 返回数据
    res.send({
        user: user,
        pagenum: page,
        total: count,
        meta: {
            "msg": "获取成功",
            "status": 200
        }
    });
}