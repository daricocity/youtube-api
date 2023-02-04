const jwt = require('jsonwebtoken');

// CREATE TOKEN
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if(err) res.status(403).json('Token not Valid!');
            req.user = user;
            next();
        })
    } else {
        res.status(401).json('You are not authenticated!');
    }
};

// USER & ADMIN AUTHORIZATION
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(403).json('You are not Authorized!');
        }
    });
};

// ADMIN AUTHORIZATION
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        } else {
            res.status(403).json('You are not Authorized!');
        }
    });
};

module.exports = {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken}