const jwt = require('jsonwebtoken');
const secret = 'wffwwffw';

module.exports = (req, res, next) => {
    // console.log(req);
    if (req.originalUrl === '/admin/login' || req.originalUrl === '/admin/register') {
        next();
    } else {
        let token = req.headers.authorization;
        let verifyToken = jwt.verify(token, secret)
            // console.log(verifyToken);
        var user_id = verifyToken._id;
        var userEmail = verifyToken.email;
        var userNickName = verifyToken.nickName;
        var role = verifyToken.role;
        var state = verifyToken.state;
        req.user_id = user_id;
        req.nickName = userNickName;
        req.role = role;
        req.state = state;
        next();
    }
}