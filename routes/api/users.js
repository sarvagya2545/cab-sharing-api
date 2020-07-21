const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../../models/User');

// @route    GET /users/test
// @desc     Test the route
// @access   Public
router.get('/test', (req, res) => res.json({ msg: 'This works even now' }));

// @route    GET /users/
// @desc     get the list of all users
// @access   ADMIN
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ userList: users });
    } catch (err) {
        res.status(503).json({ err: err.message });
    }
});

// @route    POST /users/register
// @desc     register a user into the system
// @access   Public
router.post('/register', (req,res) => {
    
});

// @route    POST /users/login
// @desc     Login route
// @access   Public
router.post('/login', (req,res) => {
    
});

module.exports = router;