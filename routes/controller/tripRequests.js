// Import Trip Requests model
const TripRequest = require('../../models/TripRequests');
const User = require('../../models/User');

// Import trip locations config file
const tripLocations = require('../../config/status').tripLocations;

// Import validators
const { validateLocation, validateTimings } = require('../../validators/tripRequestValidator');

module.exports = {
    getAllTripRequests: async (req, res) => {
        try {
            const tripRequests = await TripRequest.find();
            res.json({ tripRequestsList: tripRequests });
        } catch (err) {
            res.status(503).json({ err: err.message });
        }
    },
    createTripRequest: async (req, res) => {
        try {
            const source = req.body.source;
            const destination = req.body.destination;

            // validate the location
            if (validateLocation(source) === null || validateLocation(destination) === null) {
                const errors = {};
                if (validateLocation(source) === null) { 
                    errors.src = 'Source location is not valid.'; 
                }
                if (validateLocation(destination) === null) { 
                    errors.dest = 'Destination location is not valid.'; 
                }
                return res.status(400).json(errors);
            }

            // Validate the timings
            const { errors, isValid } = validateTimings(req.body.timings);
            if(!isValid) {
                return res.status(400).json(errors);
            }

            // If validated, then add the new tripRequest
            const newTripRequest = new TripRequest({
                user: req.user,
                route: {
                    source: validateLocation(source),
                    destination: validateLocation(destination)
                },
                timings: req.body.timings
            });

            // find the user who made the request
            const foundUser = await User.findById(req.user.id);

            // check if user is found or not
            if (foundUser) {
                // then save the tripRequest in the tripRequests database
                newTripRequest.save()
                .then(tripRequest => {
                    //send the trip request data back 
                    res.json({ tripRequest: tripRequest });
                })
                .catch(err => res.json({ err }));

                // If user is there, then add tripRequest to his profile and then save the user
                foundUser.tripRequests.push(newTripRequest);
                foundUser.save();
            } else {
                res.status(401).json({ err: 'User not found, hence request incomplete. Make sure you are logged in and then try again.' });
            }
        } catch (err) {
            res.status(500).json({ err });
        }
    },
    getTripRequestByID: async (req, res) => {
        try {
            const tripRequest = await TripRequest.findById(req.params.tripReqID);
            res.json({ tripRequest });
        } catch (err) {
            res.status(404).json({ msg: 'trip request not found' });
        }
    },
    getUsersTripRequests: async (req, res) => {
        try {
            const userRequests = await TripRequest.find({ user: req.user });
            res.json({ userRequests });
        } catch (err) {
            res.json({ err });
        }
    },
    deleteTripRequestByID: async (req, res) => {
        try {
            const requestToBeDeleted = await TripRequest.findById(req.params.tripReqID);

            // console.log(typeof requestToBeDeleted.user);     // object
            // console.log(typeof req.user.id);                 // string

            // (==) instead of (===) because of different types of req.user.id and requestToBeDeleted.user
            if (requestToBeDeleted.user == req.user.id) {

                // find the user who made the request
                const foundUser = await User.findById(req.user.id);

                // If user is there, then add tripRequest to his profile and then save the user
                foundUser.tripRequests = foundUser.tripRequests.filter(request => request != req.params.tripReqID);
                foundUser.save();
                await TripRequest.findByIdAndRemove(req.params.tripReqID);

                res.json({ msg: 'Trip Request successfully deleted' });
            } else {
                res.status(401).send('Not authorised');
            }
        } catch (err) {
            res.status(404).json({ msg: 'The trip request was not found in the database' });
            // res.send(err);
        }
    },
    deleteAllTheUsersTripRequests: async (req, res) => {
        try {
            await TripRequest.deleteMany({ user: req.user });
            res.send('deleted');
        } catch (err) {
            res.json({ err });
        }
    }
}