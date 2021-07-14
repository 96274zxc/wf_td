const { Mod } = require('../../model/mod');

module.exports = async(req, res) => {
    // 修改Mod操作
    console.log(req.params);
    console.log(req.body);
    let mod = await Mod.findOne({ "_id": req.params._id });
    // console.log(mod);
    if (!mod) {
        return res.send({
            meta: {
                "msg": "修改失败",
                "status": 400
            }
        });
    } else {
        await Mod.updateOne({ "_id": req.params._id }, {
            mod: req.body.mod,
            thumbnail: req.body.thumbnail,
            updateAt: new Date()
        });
        // 返回数据
        res.send({
            meta: {
                "msg": "修改成功",
                "status": 200
            }
        });
    }
}