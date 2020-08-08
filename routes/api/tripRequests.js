const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import TripRequestController
const TripRequestController = require('../controller/tripRequests');
const Trip = require('../../models/Trip');

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

// Trip request by id
//@route    /api/tripRequests/id/tripReqID
router.route('/id/:tripReqID')
    //@desc     Get a trip request by its id
    //@access   PUBLIC
    .get(TripRequestController.getTripRequestByID)
    //@desc     Delete a trip request by its id
    //@access   PRIVATE
    .delete(passportJWT, TripRequestController.deleteTripRequestByID);    

// User's Trip requests
//@route    /api/tripRequests/user/all
router.route('/user/all')
    //@desc     Get all the tripRequests made by the user
    //@access   PRIVATE
    .get(passportJWT, TripRequestController.getUsersTripRequests)
    //@desc     Get all the tripRequests made by the user
    //@access   PRIVATE
    .delete(passportJWT, TripRequestController.deleteAllTheUsersTripRequests);

module.exports = router;