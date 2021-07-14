const { Mod } = require('../../model/mod');
const { Sale } = require('../../model/sale');

module.exports = async(req, res) => {
    // 编辑已发布商品操作
    // console.log(req.params);
    // let mod = await Mod.findOne({ "_id": req.params.sale });
    let sale = await Sale.findOne({ "sale": req.params.sale, "seller": req.user_id });
    if (!sale) {
        return res.send({
            meta: {
                "msg": "查询失败",
                "status": 400
            }
        });
    }
    // console.log(mod);
    // 返回数据
    res.send({
        data: sale,
        meta: {
            "msg": "查询成功",
            "status": 200
        }
    });
}