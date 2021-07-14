const { Mod } = require('../../model/mod');

module.exports = async(req, res) => {
    // 编辑Mod操作
    // console.log(req.params.mod);
    let mod = await Mod.findOne({ "mod": req.params.mod });
    // console.log(mod);
    if (!mod) {
        return res.send({
            meta: {
                "msg": "查询失败",
                "status": 400
            }
        });
    } else {
        // 返回数据
        res.send({
            data: mod,
            meta: {
                "msg": "查询成功",
                "status": 200
            }
        });
    }
}