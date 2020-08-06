// Import Trip Requests model
const TripRequest = require('../../models/TripRequests');
const User = require('../../models/User');

// Import trip locations config file
const tripLocations = require('../../config/status').tripLocations;

function getLocation(location) {
    if(location === undefined) return null;
    if(location.toUpperCase() === tripLocations.CAMPUS) return 'CAMPUS';
    if(location.toUpperCase() === tripLocations.RAILWAY_STATION) return 'RAILWAY_STTAION';
    if(location.toUpperCase() === tripLocations.AIRPORT) return 'AIRPORT';
    return null;
}

module.exports = {
    getAllTripRequests: async (req, res) => {
        try{
            const tripRequests = await TripRequest.find();
            res.json({ tripRequestsList: tripRequests });
        } catch (err) {
            res.status(503).json({ err: err.message });
        }
    },
    createTripRequest: async (req,res) => {
        try {
            const newTripRequest = new TripRequest({
                user: req.user,
                route: {
                    source: getLocation(req.body.source),
                    destination: getLocation(req.body.destination)
                },
                timings: req.body.timings
            });
            
            // find the user who made the request
            const foundUser = await User.findById(req.user.id);
            
            // check if user is found or not
            if(foundUser) {
                // If user is there, then add tripRequest to his profile and then save the user
                foundUser.tripRequests.push(newTripRequest);
                foundUser.save();
    
                // then save the tripRequest in the tripRequests database
                newTripRequest.save()
                    .then(tripRequest => {
                        //send the trip request data back 
                        res.json({ tripRequest: tripRequest });
                    })
                    .catch(err => res.json({ err }));
            } else {
                res.status(401).json({ err: 'User not found, hence request incomplete. Make sure you are logged in and then try again.' });
            }    

        } catch (err) {
            console.log(err);
        }
    }
}