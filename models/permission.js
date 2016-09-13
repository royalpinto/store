var util = require('util');
var Model = require('./model');
var validators = require('./validators');


var schema = {
    group: {
        type: String,
        validations: [{
            fn: validators.string(3, 255),
        }],
    },
    noun: {
        type: String,
        validations: [{
            fn: validators.string(3, 255),
        }],
    },
    verb: {
        type: String,
        validations: [{
            fn: validators.string(1),
        }],
    },
};

var Permission = function Permission(properties) {
    Model.call(this, properties);
};


util.inherits(Permission, Model);
Object.assign(Permission, Model);

Permission.add = function(group, noun, verb) {
    var payload = {group: group, noun: noun, verb: verb};
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

Permission.remove = function(group, noun, verb) {
    var payload = {group: group, noun: noun, verb: verb};
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

Permission.check = function(group, noun, verb) {
    var payload = {group: group, noun: noun, verb: verb};
    return Permission
    .findOne(payload)
    .then(function(permission) {
        return permission !== null;
    })
    ;
};

Permission.setSchema(schema);


module.exports = Permission;
