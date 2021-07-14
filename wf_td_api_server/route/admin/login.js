// 导入用户集合构造函数
const { User } = require('../../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'wffwwffw';
module.exports = async(req, res) => {
    // 接收请求参数
    const { email, password } = req.body;
    // 根据邮箱地址查询用户信息
    // 如果查询到了用户 user变量的值是对象类型 对象中存储的是用户信息
    // 如果没有查询到用户 user变量为空
    let user = await User.findOne({ email });
    // 查询到了用户
    if (user) {
        // 将客户端传递过来的密码和用户信息中的密码进行比对
        // true 比对成功
        // false 比对失败
        let isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            // 返回token           
            const token = jwt.sign({ _id: user._id, email: user.email, nickName: user.nickName, role: user.role, state: user.state }, secret, { expiresIn: '12h' });
            res.send({ status: 200, msg: '登陆成功', token: token });
            // return res.status(200).send('登录成功');
        } else {
            // 没有查询到用户
            res.status(202).send('邮箱或密码错误');
        }
    } else {
        // 没有查询到用户
        res.status(202).send('邮箱或密码错误');
    }
}