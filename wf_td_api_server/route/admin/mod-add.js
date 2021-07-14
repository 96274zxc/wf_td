const { Mod } = require('../../model/mod');

module.exports = async(req, res) => {
    // 添加Mod操作
    // console.log(req.body);
    // console.log(req.body.mod);
    let bl = await Mod.findOne({ "mod": req.body.mod });
    if (bl) {
        return res.send({
            meta: {
                "msg": "添加失败",
                "status": 400
            }
        });
    } else {
        Mod.create({ "mod": req.body.mod, "thumbnail": req.body.thumbnail });
        // 返回数据
        res.send({
            meta: {
                "msg": "添加成功",
                "status": 201
            }
        });
    }
}