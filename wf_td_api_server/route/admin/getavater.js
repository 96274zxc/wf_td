const { User } = require('../../model/user');

module.exports = async(req, res, next) => {
    let user = await User.findOne({ "_id": req.user_id });
    res.send(user);
}