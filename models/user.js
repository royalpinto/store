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

var User = function User(properties) {
    Model.call(this, properties);
};

util.inherits(User, Model);
Object.assign(User, Model);

User.setSchema(schema);

User.prototype.hasPermission = function(noun, verb) {
    return Permission.check(this.group, noun, verb);
};

User.prototype.toJSON = function() {
    var user = this.toObject();
    delete user.salt;
    delete user.hash;
    return user;
};


module.exports = User;
