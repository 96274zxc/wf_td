// 导入用户集合构造函数
const { User } = require('../../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'wffwwffw';
module.exports = async(req, res) => {
    // 接收请求参数
    const { email, nickname, password } = req.body;
    // 根据邮箱地址查询用户信息
    // 如果查询到了用户 user变量的值是对象类型 对象中存储的是用户信息
    // 如果没有查询到用户 user变量为空
    let theemail = await User.findOne({ email });
    let thenickname = await User.findOne({ nickName: nickname });
    // 查询到了用户
    if (theemail) {
        return res.status(202).send('邮箱已被注册');
    } else if (thenickname) {
        return res.status(203).send('用户名已被注册');
    } else {
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(password, salt);
        await User.create({
            "email": email,
            "nickName": nickname,
            "password": pass
        });
        res.send({ status: 200, msg: '注册成功' });
    }
}