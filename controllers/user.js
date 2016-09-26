var util = require('util');
var crypto = require('crypto');
var models = require('./../models');
var errors = require('./../errors');
var Controller = require('./controller');


var hashPassword = function(password, salt) {
    return new Promise(function(resolve, reject) {
        salt = salt || crypto.randomBytes(16).toString('hex');
        crypto.pbkdf2(password, salt, 1000,
            512, 'sha512', function(err, key) {
                if (err) {
                    return reject(err);
                }
                resolve([salt, key.toString('hex')]);
            }
        );
    });
};


/**
 * Initialize a user controller.
 * @extends controllers.Controller
 * @memberof controllers
 * @class
 * @classdesc A user controller with methods to manage users.
 */
var UserController = function() {
    Controller.call(this, models.User);
};

util.inherits(UserController, Controller);


/**
 * Create a user from the given data.
 * @param {Object} data The data to be set to the user.
 * @return {Promise} A promise which resolves upon creation.
 */
UserController.prototype.create = function(data) {
    // Set/override the group as member.
    data = data || {};
    if (!data.password && typeof data.password !== 'string') {
        return Promise.reject(new errors.ValidationError("password invalid."));
    }
    data.group = 'member';
    var user = new models.User(data);

    return hashPassword(data.password)
    .then(function(result) {
        user.salt = result[0];
        user.hash = result[1];
        return user.save();
    })
    .then(function() {
        return user;
    })
    ;
};

/**
 * Update a user with given data.
 * @param {String/ObjectID} id The model id.
 * @param {Object} data The data to be updated.
 * @return {Promise} A promise which resolves upon completion.
 */
UserController.prototype.update = function(id, data) {
    var model;
    return this.Model
    .findById(id)
    .then(function(_model) {
        if (!_model) {
            throw new errors.ValidationError(
                "resource not found.");
        }
        model = _model;
        if (data.password) {
            return hashPassword(data.password)
            .then(function(result) {
                data.salt = result[0];
                data.hash = result[1];
            })
            ;
        }
    })
    .then(function() {
        return model.update(data);
    })
    ;
};

/**
 * Login/Validate username password.
 * @param {String} username The username.
 * @param {String} password The password.
 * @return {Promise} A promise which resolves with user model upon successful
 * login, otherwsie rejects with an error. NOTE: This does not handle sessions.
 */
UserController.prototype.login = function(username, password) {
    // Set/override the group as member.
    var user = null;
    return models.User
    .findByKey('username', username)
    .then(function(_user) {
        user = _user;
        if (!user) {
            throw new errors.ValidationError("Invalid credentials.");
        }
        return hashPassword(password, _user.salt);
    })
    .then(function(result) {
        if (result[1] !== user.hash) {
            throw new errors.ValidationError("Invalid credentials.");
        }
        return user;
    })
    ;
};

/**
 * Check if user has permission for the verb(task) on a given noun(module).
 * @param {String} userid The user id for which permission to be checked.
 * @param {String} noun The noun or module on which permission to be checked.
 * @param {String} verb The verb or task.
 * @return {Promise} A promise which resolves with a flag indicating the
 * permission.
 */
UserController.prototype.hasPermission = function(userid, noun, verb) {
    return models.User
    .findById(userid)
    .then(function(user) {
        return user && user.hasPermission(noun, verb);
    })
    ;
};

module.exports = UserController;
