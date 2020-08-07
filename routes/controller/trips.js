const Trip = require('../../models/Trip');

module.exports = {
    getAll: async (req,res) => {
        try {
            const trips = await Trip.find();
            res.json({ tripsList: trips });
        } catch (err) {
            res.status(503).json({ err: err.message });
        }
    },
    addTrip: async (req,res) => {
        try {
            // console.log('req.user', req.user);
            // const trip = new Trip({
            //     admins: [req.user],
            //     passengers: [req.user],
            // });

        } catch (err) {
            res.status(500).json({ err: err.message });
        }
    }
}