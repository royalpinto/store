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
            fn: validators.email,
        }],
    },
    username: {
        type: String,
        unique: true,
        validators: [{
            fn: function(value, key) {
                if (/^[a-zA-Z0-9]+$/.test(key)) {
                    return;
                }
                return "Invalid username.";
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
