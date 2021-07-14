const { User } = require('../../model/user');
const { Comment } = require('../../model/comment');

module.exports = async(req, res) => {
    // console.log(req.user_id);
    // console.log(req.query);
    // 指定查询参数
    let master = req.query.master;
    // var str = ".*" + query + ".*$"
    // var reg = new RegExp(str);
    // 接收客户端传递过来的当前页参数
    let page = parseInt(req.query.pagenum);
    // 每一页显示的数据条数
    let pagesize = parseInt(req.query.pagesize);
    // 查询用户数据的总数
    // let count = await Mod.countDocuments({});
    // 总页数
    // let total = Math.ceil(count / pagesize);
    // 页码对应的数据查询开始位置
    let start = (page - 1) * pagesize;
    // 将评论信息从数据库中查询出来
    var user = await User.findOne({ "nickName": master }).limit(pagesize).skip(start);
    // console.log(user._id);
    // if (query == '') {
    //     var mod = await Mod.find({}).limit(pagesize).skip(start);
    // } else {
    //     var mod = await Mod.find({ "mod": { $regex: reg, $options: 'i' } }).limit(pagesize).skip(start);
    //     count = await Mod.countDocuments({ "mod": { $regex: reg, $options: 'i' } });
    // }
    var comment = await Comment.find({ "master": user._id }).populate('author').limit(pagesize).skip(start);
    let count = await Comment.countDocuments({ "master": user._id });
    // console.log(comment);
    // 返回数据
    res.send({
        comment: comment,
        pagenum: page,
        total: count,
        currentUser: req.nickName,
        meta: {
            "msg": "获取成功",
            "status": 200
        }
    });
}