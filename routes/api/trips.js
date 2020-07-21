const express = require('express');
const router = express.Router();

// Import Trip model
const Trip = require('../../models/Trip');

//@route    GET /api/trips/test
//@desc     testing
//@access   PUBLIC
router.get('/test', (req, res) => res.json({ msg: 'works' }));

//@route    GET /api/trips/all
//@desc     get all trips
//@access   PUBLIC
router.get('/all', async (req,res) => {
    try {
        const trips = await Trip.find();
        res.json({ tripsList: trips });
    } catch (err) {
        res.status(503).json({ err: err.message });
    }
});

module.exports = router;