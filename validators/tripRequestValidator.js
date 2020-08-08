// Import trip locations config file
const tripLocations = require('../config/status').tripLocations;

// This file will validate the names of places which have been input
module.exports = {
    validateLocation: location => {
        if (!location) return null;
        if (location.toUpperCase() === tripLocations.CAMPUS) return 'CAMPUS';
        if (location.toUpperCase() === tripLocations.RAILWAY_STATION) return 'RAILWAY_STATION';
        if (location.toUpperCase() === tripLocations.AIRPORT) return 'AIRPORT';
        return null;
    },
    validateTimings: timings => {
        // console.log(timings);

        const errors = {};
        let isValid = false;
        if(!Array.isArray(timings)) {       // Check whether timings is an array or not 
            errors.timings = 'req.body.timings is not an array';
        } else if(timings.length <= 0) {    // Check if timings has any timings at all
            errors.timings = 'No timing provided';
        } else { 
            // Now check if the given timings are of type object with only 2 parameters of type date
            for( i = 0 ; i < timings.length ; i++ ) {
                if(typeof timings[i] !== "object") {
                    errors.timings = 'One of the timings provided is not of type object';
                    break;
                }
                
                if(!isValidDate(timings[0].from)) {
                    errors.fromTime = 'The value provided to the \'from\' field is not a valid date';
                }
                
                if(!isValidDate(timings[0].to)) {
                    errors.toTime = 'The value provided to the \'to\' field is not a valid date';
                }
            }
        }

        if(isEmpty(errors)) {
            isValid = true;
        }

        // console.log(errors, isValid);

        return { errors , isValid };
    }
}

// function to check if the date given is valid or not
// ALWAYS SEND THE DATE IN ISO STRING FORMAT ONLY
function isValidDate(isodate) {
    try{
        date = new Date(isodate);    
        return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
    } catch(e) {
        return false;
    }
}

function isEmpty(obj) {
    const keys = Object.keys(obj);
    return (keys.length === 0);     
}