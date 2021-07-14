const { Sale } = require('../../model/sale');

module.exports = async(req, res) => {
    // 删除已发布商品操作
    // console.log(req.params);
    // console.log(req.body);
    let sale = await Sale.findOne({ "_id": req.params._id });
    // console.log(mod);
    if (!sale) {
        return res.send({
            meta: {
                "msg": "修改失败",
                "status": 400
            }
        });
    } else {
        await Sale.deleteOne({ "_id": req.params._id });
        // 返回数据
        res.send({
            meta: {
                "msg": "修改成功",
                "status": 200
            }
        });
    }
}