const jwt = require('jsonwebtoken');
const CryptoJs = require('crypto-js');
const User = require('../models/User');
const router = require('express').Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(user){
            return res.status(400).json('Username Exist!')
        }
        // Input
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SECRET_SEC).toString(),
        });
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (err){
        return res.status(500).json(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(user){
            // Decrypt Password and Validate
            const hashPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SECRET_SEC);
            const originalPassword = hashPassword.toString(CryptoJs.enc.Utf8);
            if(originalPassword !== req.body.password){
                return res.status(400).json('Wrong Password!');
            }
            // JWT
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            }, process.env.JWT_SECRET_KEY, {expiresIn:'3d'});
            const {password, ...others} = user._doc;
            return res.status(200).json({...others, accessToken});
        } else {
            return res.status(400).json('Wrong Username!');
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;