var util = require('util');
var Model = require('./model');

var schema = {
    group: {
        type: String,
        required: true,
    },
    noun: {
        type: String,
        required: true,
    },
    verb: {
        type: String,
        required: true,
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
