const jwt = require('jsonwebtoken');

const User = require('../../models/User');

const signToken = user => {
    return jwt.sign({
        iss: 'Sarvagya',
        sub: user.id,
        iat: new Date().getTime()
    }, process.env.JWT_SECRET);
}

module.exports = {
    googleOAuth: async (req,res,next) => {
        console.log('req.user', req.user);

        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    secret: async (req,res,next) => {
        console.log('You have reached the secret route');
        res.json({ secret: 'This is my secret' });
    }
}