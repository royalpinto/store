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

/**
 * Initialize a permission model with given properties.
 * @param {Object} [properties={}] The properties to be set.
 * @param {String} [properties.group] The group name.
 * @param {String} [properties.noun] A noun.
 * @param {String} [properties.verb] A verb.
 * @class
 * @extends models.Model
 * @memberof models
 * @classdesc Instances of the Permission class represent a single permission
 * document.
 */
var Permission = function Permission(properties) {
    Model.call(this, properties);
};


util.inherits(Permission, Model);
Object.assign(Permission, Model);

/**
 * Add/Set permission.
 * @param {String} group A group.
 * @param {String} noun A noun.
 * @param {String} verb A verb.
 * @return {Promise} A promise which resolves upon success and rejects with an
 * error upon failure.
 */
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

/**
 * Remove/Unset permission.
 * @param {String} group A group.
 * @param {String} noun A noun.
 * @param {String} verb A verb.
 * @return {Promise} A promise which resolves upon success and rejects with an
 * error upon failure.
 */
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

/**
 * Check permission.
 * @param {String} group A group.
 * @param {String} noun A noun.
 * @param {String} verb A verb.
 * @return {Promise} A promise which resolves upon success and rejects with an
 * error upon failure.
 */
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
