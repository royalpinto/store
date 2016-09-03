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
    password: {
        type: String,
        validations: [{
            fn: validators.string(5, 255),
        }],
    },
};

var User = function User(properties) {
    Model.call(this, properties);
};

util.inherits(User, Model);
Object.assign(User, Model);

User.setSchema(schema);

User.prototype.setPermission = function(noun, verb) {
    var payload = {userid: this._id, noun: noun, verb: verb};
    return Permission
    .findOne(payload)
    .then(function(permission) {
        // If permission is already set, do nothing.
        if (permission) {
            return;
        }

        permission = new Permission(payload);
        return permission.save();
    })
    ;
};

User.prototype.unsetPermission = function(noun, verb) {
    var payload = {userid: this._id, noun: noun, verb: verb};
    return Permission
    .findOne(payload)
    .then(function(permission) {
        // If permission is not set, do nothing.
        if (!permission) {
            return;
        }
        return permission.remove();
    })
    ;
};

User.prototype.hasPermission = function(noun, verb) {
    return Permission
    .findOne({userid: this._id, noun: noun, verb: verb})
    .then(function(permission) {
        return permission !== null;
    })
    .catch(function() {
        return false;
    })
    ;
};


module.exports = User;
