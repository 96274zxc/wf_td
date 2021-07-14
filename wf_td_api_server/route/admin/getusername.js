module.exports = (req, res, next) => {
    res.send({
        data: {
            usernickname: req.nickName,
            userrole: req.role
        }
    });
}