const { Mod } = require('../../model/mod');
const { Sale } = require('../../model/sale');

module.exports = async(req, res) => {
    // 发布商品操作
    // console.log(req.body);
    // console.log(req.user_id, req.nickName);
    // 验证是否有该种物品
    const mbl = await Mod.findOne({ "mod": req.body.sale });
    // console.log(mbl);
    if (!mbl) {
        return res.send({
            meta: {
                "msg": "发布商品失败,不存在此物品！",
                "status": 400
            }
        });
    }
    var saleId = mbl._id;
    // 验证当前用户是否已发布过该商品
    const bl = await Sale.findOne({ "seller": req.user_id, "sale": mbl._id });
    if (bl) {
        return res.send({
            meta: {
                "msg": "发布商品失败,您已发布过该商品,请选择修改操作！",
                "status": 400
            }
        });
    } else {
        Sale.create({
            "seller": req.user_id,
            "sale": saleId,
            "price": req.body.price,
            "quantity": req.body.quantity,
            "rank": req.body.rank
        });
        res.send({
            meta: {
                "msg": "添加成功",
                "status": 201
            }
        });
    }
}