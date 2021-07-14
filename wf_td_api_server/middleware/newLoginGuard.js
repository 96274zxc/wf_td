module.exports = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.send({
            meta: {
                "msg": "无权访问该页面",
                "status": 400
            }
        })
    } else next();
}