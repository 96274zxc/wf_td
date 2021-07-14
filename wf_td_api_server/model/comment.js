// 引入mongoose模块
const mongoose = require('mongoose');
// 创建评论集合规则
const commentSchema = new mongoose.Schema({
    // 获得评论玩家
    master: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // 评论用户
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // 评论内容
    content: {
        type: String
    },
    // 评论时间
    creatAt: {
        type: Date,
        default: Date.now
    }
});
// 创建评论集合
const Comment = mongoose.model('Comment', commentSchema);

async function createComment() {
    const comment = Comment.create({
        master: '609c03d1cadc42201cd90697',
        author: '609d1ec4f027230634a5be4e',
        content: '测试评论内容'
    });
}
// createComment();

// 将评论集合构造函数作为模块成员进行导出
module.exports = {
    Comment
}