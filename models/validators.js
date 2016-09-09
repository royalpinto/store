var util = require('util');
var mongodb = require('mongodb');


module.exports = {
    required: function(value, key) {
        return new Promise(function(resolve, reject) {
            if (value) {
                resolve();
            }
            reject(util.format("%s is required.", key));
        });
    },
    ObjectID: function(value, key) {
        return new Promise(function(resolve, reject) {
            if (!value) {
                return resolve();
            }
            if (mongodb.ObjectID.isValid(value)) {
                if (!(value instanceof mongodb.ObjectID)) {
                    value = new mongodb.ObjectID(value);
                }
                return resolve(value);
            }
            reject(util.format("%s is invalid.", key));
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

                if (min !== undefined && value < min) {
                    return reject(util.format("%s is too small.", key));
                }

                if (max !== undefined && value > max) {
                    return reject(util.format("%s is too large.", key));
                }
                resolve();
            });
        };
    },
};
