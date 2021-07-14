const { Mod } = require('../../model/mod');

module.exports = async(req, res) => {
    // 删除Mod操作
    // console.log(req.params);
    // console.log(req.body);
    let mod = await Mod.findOne({ "_id": req.params._id });
    // console.log(mod);
    if (!mod) {
        return res.send({
            meta: {
                "msg": "删除失败",
                "status": 400
            }
        });
    } else {
        await Mod.deleteOne({ "_id": req.params._id });
        // 返回数据
        res.send({
            meta: {
                "msg": "删除成功",
                "status": 200
            }
        });
    }
}