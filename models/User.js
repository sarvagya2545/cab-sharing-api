const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    trips: [{
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    }],
    pastTrips: [{
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    }],
    tripRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'TripRequest'
    }]
});

module.exports = mongoose.model('User', userSchema);