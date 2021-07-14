module.exports = (req, res, next) => {
    // console.log(req.state);
    if (req.state !== true) {
        return res.send({
            meta: {
                "msg": "无权访问该页面",
                "status": 400
            }
        })
    } else next();
}