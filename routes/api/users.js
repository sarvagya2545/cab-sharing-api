require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../../models/User');

require('../../config/passport');

const signToken = user => {
    return jwt.sign({
        iss: 'Sarvagya',
        sub: user.id,
        iat: new Date().getTime()
    }, process.env.JWT_SECRET);
}

// @route    GET /users/test
// @desc     Test the route
// @access   Public
router.get('/test', (req, res) => res.json({ msg: 'This works even now' }));

// Oauth route for google
router.route('/oauth/google')
    .post(passport.authenticate('googleToken', { session: false }), async (req,res,next) => {
        console.log('req.user', req.user);

        const token = signToken(req.user);
        res.status(200).json({ token });
    });

// secret route which is accessible only when the google oauth sends a valid token 
router.route('/secret')
    .get(passport.authenticate('jwt', { session: false }), async (req,res,next) => {
        console.log('You have reached the secret route');
        res.json({ secret: 'This is my secret' });
    });

module.exports = router;