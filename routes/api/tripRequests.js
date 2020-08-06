const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import TripRequestController
const TripRequestController = require('../controller/tripRequests');

// Import passportJWT and passport strategy
const passportJWT = passport.authenticate('jwt', { session: false });
require('../../config/passport');

//@route    GET /api/tripRequests/test
//@desc     testing
//@access   PUBLIC
router.get('/test', (req, res) => res.json({ msg: 'works' }));

//@route    GET /api/tripRequests/all
//@desc     get the list of all trip requests
//@access   PUBLIC
router.get('/all', TripRequestController.getAllTripRequests);

//@route    POST /api/tripRequests/create
//@desc     Create a trip request
//@access   PRIVATE
router.post('/create', passportJWT ,TripRequestController.createTripRequest);

module.exports = router;