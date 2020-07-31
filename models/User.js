const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    trips: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Trip'
        }],
        default: []
    },
    pastTrips: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Trip'
        }],
        default: []
    },
    tripRequests: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'TripRequest'
        }],
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);