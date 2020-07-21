const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    passengers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    route: {
        type: {
            source: {
                type: String,
                required: true
            },
            destination: {
                type: String,
                required: true
            }
        },
        required: true
    },
    maxPassengers: {
        type: Number,
        min: 2
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trip', tripSchema);