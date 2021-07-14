// 创建商品集合
// 引入mongoose第三方模块
const mongoose = require('mongoose');
// 创建用户集合规则
const saleSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mod'
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    rank: {
        type: Number
    },
    publishTime: {
        type: Date,
        default: Date.now
    }
});
// 创建集合
const Sale = mongoose.model('Sale', saleSchema);

async function createSale() {
    const sale = Sale.create({
        seller: '609c03d1cadc42201cd90697',
        sale: '609c20d204b4852f84b197aa',
        price: 10,
        quantity: 1,
        rank: 0
    });
}
// createSale();

module.exports = {
    Sale
};