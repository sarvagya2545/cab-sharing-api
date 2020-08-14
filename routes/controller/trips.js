const Trip = require('../../models/Trip');
const User = require('../../models/User');
const { tripPassengerStat } = require('../../config/status');
const { validateLocation, validateTimings } = require('../../validators/tripRequestValidator');
const users = require('./users');

module.exports = {
    getAll: async (req, res) => {
        try {
            const trips = await Trip.find();
            res.json({ tripsList: trips });
        } catch (err) {
            res.status(503).json({ err: err.message });
        }
    },
    getTripByID: async (req, res) => {
        try {
            const trip = await Trip.findById(req.params.trip_id);
            res.send(trip);
        } catch (err) {
            console.log(err);
        }
    },
    addTrip: async (req, res) => {
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
            if (!isValid) {
                return res.status(400).json(errors);
            }

            // create a new trip
            const newTrip = new Trip({
                passengers: [
                    {
                        user: req.user,
                        status: tripPassengerStat.ADMIN
                    }
                ],
                route: {
                    source: validateLocation(source),
                    destination: validateLocation(destination)
                },
                timings: req.body.timings,
                maxPassengers: req.body.passengersLimit
            });

            // console.log('newTrip', newTrip);
            // find the user who made the request
            const foundUser = await User.findById(req.user.id);

            // check if user is found or not
            if (foundUser) {
                // then save the trip in the trips database
                newTrip.save()
                .then(trip => {
                    //send the trip data back 
                    res.json({ trip: trip });
                })
                .catch(err => res.json({ err }));

                // If user is there, then add trip to his profile and then save the user
                foundUser.trips.push(newTrip);
                foundUser.save();

            } else {
                res.status(401).json({ err: 'User not found, hence request incomplete. Make sure you are logged in and then try again.' });
            }
        } catch (err) {
            res.status(500).json({ err: err.message });
        }
    },
    getAllUsersTrips: async (req,res) => {
        try{
            // get all the trips
            const allTrips = await Trip.find();

            const userToBeFound = req.user;
            
            // Filter out the trips where the user is a passenger.
            const usersTrips = allTrips.filter(trip => {
                const passengers = trip.passengers;
                let userFound = false;

                for(let passenger of passengers) {
                    if(passenger.user == userToBeFound.id){
                        userFound = true;
                        break;
                    }
                }

                return userFound;
            });

            res.send(usersTrips);

        } catch (e) {
            console.log(e);
            res.status(500).json({ err: 'Server error' });
        }
    },
    deleteTripById: async (req,res) => {
        try {
            const tripToBeDeleted = await Trip.findById(req.params.trip_id);
            const passengers = tripToBeDeleted.passengers;

            let isDeleteValid = false;

            for(let passenger of passengers) {
                if(passenger.user == req.user.id && passenger.status == tripPassengerStat.ADMIN) {
                    isDeleteValid = true;
                }
            }

            if(!isDeleteValid) {
               return res.status(401).send('Not authorised. Only admins can delete the trip.');
            } 

            // To delete the trip from database
            await Trip.findByIdAndRemove(req.params.trip_id);

            // Go through all the passengers and delete their trip from their trips array
            const passengerIDs = passengers.map(passenger => passenger.user);

            let users = await User.find().where('_id').in(passengerIDs).exec();

            users.forEach(async (foundUser) => {
                foundUser.trips = foundUser.trips.filter(trip => trip != req.params.trip_id);

                await foundUser.save();
            });

            res.json({ msg: 'The trip was successfully deleted' });

        } catch (err) {
            res.status(404).json({ msg: 'The trip was not found in the database' });
            console.log(err);
        }
    }
}