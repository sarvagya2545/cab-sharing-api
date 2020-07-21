const { Schema } = require("mongoose");

const mongoose = require("mongoose");

const tripRequestSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
        }
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
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("TripRequest", tripRequestSchema);
