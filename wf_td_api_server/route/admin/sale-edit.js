const { Mod } = require('../../model/mod');
const { Sale } = require('../../model/sale');

module.exports = async(req, res) => {
    // 修改商品操作
    console.log(req.params);
    console.log(req.body);
    const bl = await Sale.findOne({ _id: req.params._id });
    if (!bl) {
        return res.send({
            meta: {
                "msg": "修改发布商品失败,不存在此商品！",
                "status": 400
            }
        });
    } else {
        await Sale.updateOne({ "_id": req.params._id }, {
            "price": req.body.price,
            "quantity": req.body.quantity,
            "rank": req.body.rank,
            "publishTime": new Date()
        });
        res.send({
            meta: {
                "msg": "添加成功",
                "status": 200
            }
        });
    }
}