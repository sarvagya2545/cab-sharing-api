const express = require('express');
const router = express.Router();

// Import Trip Requests model
const TripRequest = require('../../models/TripRequests');

//@route    GET /api/tripRequests/test
//@desc     testing
//@access   PUBLIC
router.get('/test', (req, res) => res.json({ msg: 'works' }));

//@route    GET /api/tripRequests/all
//@desc     get the list of all trip requests
//@access   PUBLIC
router.get('/all', async (req, res) => {
    try{
        const tripRequests = await TripRequest.find();
        res.json({ tripRequestsList: tripRequests });
    } catch (err) {
        res.status(503).json({ err: err.message });
    }
});

module.exports = router;