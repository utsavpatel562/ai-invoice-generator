const jwt = require('jsonwebtoken');
const User = require('../modules/User');
const protect = async(req, resizeBy, next) => {
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
        // get token from header
        token = req.headers.authorization.split(' ')[1];
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // get user from token
        req.user = await User.findById(decoded.id).select('-password');
        next();
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'});
        }
    }
    if(!token) {
        return res.status(401).json({message: 'Not authorized, no token'});
    }
}

module.exports = {protect};