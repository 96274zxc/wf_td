const { User } = require('../../model/user');

module.exports = async(req, res) => {
    let email = req.params.email;
    User.findOne({ "email": email }, function(err, data) {
        data.state = !data.state; //赋值修改
        data.save(); //保存
        res.send('更新用户状态成功'); //返回响应结果给前端
    });
}