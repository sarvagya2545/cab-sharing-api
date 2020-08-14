const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import Trip model
const Trip = require('../../models/Trip');

// Import trip controller
const TripController = require('../controller/trips');

// Passport auth
const passportJWT = passport.authenticate('jwt', { session: false });

//@route    GET /trips/test
//@desc     testing
//@access   PUBLIC
router.get('/test', (req, res) => res.json({ msg: 'trips works' }));

//@route    GET /trips/all
//@desc     get all trips
//@access   PUBLIC
router.get('/all', TripController.getAll);

// @route   /trips/:trip_id
router.route('/id/:trip_id')
    // @desc    get the trip by its id
    // @access  PUBLIC
    .get(TripController.getTripByID)
    // @desc    delete the trip by its id
    // @access  USER 
    .delete(passportJWT, TripController.deleteTripById);

// @route   POST /trips/create
// @desc    create a trip
// @access  User only
router.route('/create')
    .post(passportJWT, TripController.addTrip);

// @route   /trips/user/all 
router.route('/user/all')
    // @desc    get all the trips of the user
    // @access  User only
    .get(passportJWT, TripController.getAllUsersTrips)

module.exports = router;