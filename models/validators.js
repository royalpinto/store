var util = require('util');


module.exports = {
    required: function(value, key) {
        return new Promise(function(resolve, reject) {
            if (value) {
                resolve();
            }
            reject(util.format("%s is required.", key));
        });
    },
    email: function(value, key) {
        if (value) {
            return;
        }
        return util.format("%s is invalid.", key);
    },
    string: function(min, max) {
        return function(value, key) {
            if (!value) {
                return util.format("%s is required.", key);
            }

            if (min && value.length < min) {
                return util.format("%s is too small.", key);
            }

            if (max && value.length > max) {
                return util.format("%s is too small.", key);
            }
        };
    },
    number: function(min, max) {
        return function(value, key) {
            if (isNaN(value)) {
                return util.format("%s is invalid.", key);
            }

            if (!value) {
                return util.format("%s is required.", key);
            }

            if (min !== undefined && value < min) {
                return util.format("%s is too small.", key);
            }

            if (min !== undefined && value > max) {
                return util.format("%s is too small.", key);
            }
        };
    },
};
