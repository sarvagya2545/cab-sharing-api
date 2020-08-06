const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import Trip model
const Trip = require('../../models/Trip');

// Import trip controller
const TripController = require('../controller/trips');

// Passport auth
const passportGoogle = passport.authenticate('googleToken', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

//@route    GET /trips/test
//@desc     testing
//@access   PUBLIC
router.get('/test', (req, res) => res.json({ msg: 'works' }));

//@route    GET /trips/all
//@desc     get all trips
//@access   PUBLIC
router.get('/all', TripController.getAll);

// @route   GET /trips/:trip_id
// @desc    get the trip by its id
// @access  PUBLIC
router.route('/:trip_id')
    .get(async(req,res) => {
        try{
            const trip = await Trip.findById(req.params.trip_id);
            console.log(trip);
        } catch(err) {
            console.log(err);
        }
    })

// @route   POST /trips/create
// @desc    create a trip
// @access  User only
router.route('/create')
    .post(passportJWT, TripController.addTrip);

module.exports = router;