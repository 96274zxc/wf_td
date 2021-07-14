const { Comment } = require('../../model/comment');
const { User } = require('../../model/user');

module.exports = async(req, res) => {
    // console.log(req.body);
    // console.log(req.nickName);
    // var str = ".*" + req.body.comment + ".*$"
    // var reg = new RegExp(str);
    const comment = req.body.comment;
    const master = await User.findOne({ "nickName": req.body.master });
    const author = await User.findOne({ "nickName": req.nickName });
    // console.log(master);
    await Comment.create({
        "master": master._id,
        "author": author._id,
        "content": comment
    });
    res.send({
        meta: {
            "msg": "添加成功",
            "status": 201
        }
    });
}