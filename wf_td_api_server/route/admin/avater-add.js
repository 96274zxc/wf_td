const { User } = require('../../model/user');

module.exports = async(req, res) => {
    // console.log(req.body);
    let bl = await User.findOne({ "_id": req.user_id });
    if (!bl) {
        return res.send({
            meta: {
                "msg": "添加失败",
                "status": 400
            }
        });
    } else {
        await User.updateOne({ "_id": req.user_id }, { "avatar": req.body.avater });
        // 返回数据
        res.send({
            meta: {
                "msg": "添加成功",
                "status": 201
            }
        });
    }
}