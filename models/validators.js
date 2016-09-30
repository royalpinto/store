'use strict';


/**
 * @module models.validators
 * @namespace models.validators
 */

const util = require('util');
const mongodb = require('mongodb');

// TODO: This regex needs improvements.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


module.exports = {
    /**
     * A validator to check if given value is a valid `ObjectID`.
     * @param {Boolean} required A flag to set if value is required.
     * @memberof models.validators
     * @return {Function} A validator function which returns a `Promise`
     * (which resolves with a casted value if validation passes through,
     * otherwise rejects with a ValidationError).
     */
    objectID: required => {
        return (value, key) => {
            return new Promise((resolve, reject) => {
                if (required && !value) {
                    return reject(util.format("%s is required.", key));
                }
                if (mongodb.ObjectID.isValid(value)) {
                    if (!(value instanceof mongodb.ObjectID)) {
                        value = new mongodb.ObjectID(value);
                    }
                    return resolve(value);
                }
                reject(util.format("%s is invalid.", key));
            });
        };
    },
    /**
     * A validator to check if given value is a valid email.
     * @param {Boolean} required A flag to set if value is required.
     * @memberof models.validators
     * @return {Function} A validator function which returns a `Promise`
     * (which resolves with a casted value if validation passes through,
     * otherwise rejects with a ValidationError).
     */
    email: required => {
        return (value, key) => {
            return new Promise((resolve, reject) => {
                if (required && !value) {
                    return reject(util.format("%s is required.", key));
                }
                if (emailRegex.test(value)) {
                    return resolve();
                }
                reject(util.format("%s is invalid.", key));
            });
        };
    },
    /**
     * A validator to check if given value is a valid string.
     * @param {Number} [min] String should not be lesser than given min value.
     * @param {Number} [max] String should not be greater than given max value.
     * @memberof models.validators
     * @return {Function} A validator function which returns a `Promise`
     * (which resolves with a casted value if validation passes through,
     * otherwise rejects with a ValidationError).
     */
    string: (min, max) => {
        return (value, key) => {
            return new Promise((resolve, reject) => {
                if (!value) {
                    return reject(util.format("%s is required.", key));
                }

                if (min && value.length < min) {
                    return reject(util.format("%s is too small.", key));
                }

                if (max && value.length > max) {
                    return reject(util.format("%s is too large.", key));
                }
                resolve();
            });
        };
    },
    /**
     * A validator to check if given value is a valid number.
     * @param {Number} [min] Value should not be lesser than min value.
     * @param {Number} [max] Value should not be greater than max value.
     * @memberof models.validators
     * @return {Function} A validator function which returns a `Promise`
     * (which resolves with a casted value if validation passes through,
     * otherwise rejects with a ValidationError).
     */
    number: (min, max) => {
        return (value, key) => {
            return new Promise((resolve, reject) => {
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
