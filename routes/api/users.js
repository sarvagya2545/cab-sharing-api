const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const UserController = require('../controller/users');

const passportGoogle = passport.authenticate('googleToken', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

const router = express.Router();

const User = require('../../models/User');

require('../../config/passport');

// @route    GET /users/test
// @desc     Test the route
// @access   Public
router.get('/test', (req, res) => res.json({ msg: 'This works even now' }));

// Oauth route for google
router.route('/oauth/google')
    .post(passportGoogle, UserController.googleOAuth);

// secret route which is accessible only when the google oauth sends a valid token (only for testing purpose)
router.route('/secret')
    .get(passportJWT, UserController.secret);

module.exports = router;