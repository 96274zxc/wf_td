const path = require('path');
const fs = require('fs');

module.exports = async(req, res) => {
    //req.files post文件 originalname为文件名
    // console.log(req.files[0].originalname);

    //获取原始拓展名+后缀名
    var newName = req.files[0].path + path.parse(req.files[0].originalname).ext;
    // console.log(newName);
    //重命名
    fs.rename(req.files[0].path, newName, function(err) {
        if (err) {
            res.send('上传失败');
        } else {
            res.send({
                "path": newName.slice(6),
                "msg": "上传成功"
            });
        }
    });
}