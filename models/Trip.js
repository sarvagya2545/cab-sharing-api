const mongoose = require("mongoose");

const stats = require('../config/status');

const tripSchema = new mongoose.Schema({
    passengers: {
        type: [
            {
                user : {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                // 3 types of stats => PENDING, MEMBER, ADMIN
                status: {
                    type: 'String',
                    default: stats.tripPassengerStat.PENDING
                },
            }
        ],
    },
    route: {
        type: {
            source: {
                type: String,
                required: true,
            },
            destination: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    timings: [
        {
            from: {
                type: Date,
                required: true,
            },
            to: {
                type: Date,
                required: true,
            },
        },
    ],
    maxPassengers: {
        type: Number,
        min: 2,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    // people who ask for joining the trip
    requests: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: []
    },
});

module.exports = mongoose.model("Trip", tripSchema);
