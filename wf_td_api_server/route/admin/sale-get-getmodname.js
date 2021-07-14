const { Mod } = require('../../model/mod');

module.exports = async(req, res) => {
    // 获取Mod名称
    // console.log(req.params);
    let mod = await Mod.findOne({ _id: req.params.modId });
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