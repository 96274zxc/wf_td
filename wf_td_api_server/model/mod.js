// 创建商品集合
// 引入mongoose第三方模块
const mongoose = require('mongoose');
// 创建用户集合规则
const modSchema = new mongoose.Schema({
    mod: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    thumbnail: {
        type: String,
        default: null
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});
// 创建集合
const Mod = mongoose.model('Mod', modSchema);

async function createMod() {
    const mod = Mod.create({
        mod: 'Jahu'
    });
}
// createMod();

module.exports = {
    Mod
};