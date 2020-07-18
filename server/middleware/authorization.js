const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = async(req, res, next) => {
    try {
        //1. check if token received from client side is empty
        const jwtToken = req.header('token');

        if(!jwtToken) {
            return res.status(403).json('unauthorized access')
        }

        //2. we supply/compare this payload to jwtGenerator payload in order to access within routes
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user;
        next();
        
    } catch (err) {
        console.error(err.message)
        return res.status(403).json('unauthorized access');
    }
}