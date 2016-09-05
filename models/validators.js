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
        return new Promise(function(resolve, reject) {
            if (value) {
                resolve();
            }
            reject(util.format("%s is invalid.", key));
        });
    },
    string: function(min, max) {
        return function(value, key) {
            return new Promise(function(resolve, reject) {
                if (!value) {
                    return reject(util.format("%s is required.", key));
                }

                if (min && value.length < min) {
                    return reject(util.format("%s is too small.", key));
                }

                if (max && value.length > max) {
                    return reject(util.format("%s is too small.", key));
                }
                resolve();
            });
        };
    },
    number: function(min, max) {
        return function(value, key) {
            return new Promise(function(resolve, reject) {
                if (isNaN(value)) {
                    return reject(util.format("%s is invalid.", key));
                }

                if (!value) {
                    return reject(util.format("%s is required.", key));
                }

                if (min !== undefined && value < min) {
                    return reject(util.format("%s is too small.", key));
                }

                if (min !== undefined && value > max) {
                    return reject(util.format("%s is too small.", key));
                }
                reject();
            });
        };
    },
};
