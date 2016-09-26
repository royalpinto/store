var util = require('util');
var Model = require('./model');
var Permission = require('./permission');
var validators = require('./validators');

var schema = {
    name: {
        type: String,
        validations: [{
            fn: validators.string(5, 255),
        }],
    },
    email: {
        type: String,
        validations: [{
            fn: validators.email(true),
        }],
    },
    username: {
        type: String,
        unique: true,
        validations: [{
            fn: function(value) {
                return new Promise(function(resolve, reject) {
                    if (/^[a-zA-Z0-9]+$/.test(value)) {
                        resolve();
                    }
                    reject("Invalid username.");
                });
            },
        }],
    },
    group: {
        type: String,
        validations: [{
            fn: validators.string(5, 255),
        }],
    },
    salt: {
        type: String,
    },
    hash: {
        type: String,
    },
};

/**
 * Initialize a user with given properties.
 * @param {Object} [properties={}] The properties to be set to the user.
 * @param {String} [properties.name] Name of the user.
 * @param {String} [properties.email] Email Id of the user.
 * @param {String} [properties.username] The unique username.
 * @param {String} [properties.group] The group for which user belongs to.
 * @param {String} [properties.hash] Hash generated from the password.
 * @param {String} [properties.salt] Salt used to generate the hash.
 * @class
 * @extends models.Model
 * @memberof models
 * @classdesc Instances of the User class represent a single user db document.
 */
var User = function User(properties) {
    Model.call(this, properties);
};

util.inherits(User, Model);
Object.assign(User, Model);

User.setSchema(schema);

/**
 * Check if user permission for the verb(task) on a given noun(module).
 * @param {String} noun The noun or module on which permission to be checked.
 * @param {String} verb The verb or task.
 * @return {Promise} A promise which resolves with a flag indicating the
 * permission.
 */
User.prototype.hasPermission = function(noun, verb) {
    return Permission.check(this.group, noun, verb);
};

/**
 * Convert user object to a plain JavaScript object. This is overriden method to
 * skip password specific properties.
 * @return {Object} A converted plain JavaScript Object.
 */
User.prototype.toJSON = function() {
    var user = this.toObject();
    delete user.salt;
    delete user.hash;
    return user;
};


module.exports = User;
