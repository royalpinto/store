'use strict';


const crypto = require('crypto');
const models = require('./../models');
const errors = require('./../errors');
const Controller = require('./controller');


const hashPassword = (password, salt) => {
    return new Promise((resolve, reject) => {
        salt = salt || crypto.randomBytes(16).toString('hex');
        crypto.pbkdf2(password, salt, 1000,
            512, 'sha512', (err, key) => {
                if (err) {
                    return reject(err);
                }
                resolve([salt, key.toString('hex')]);
            }
        );
    });
};


/**
 * @extends controllers.Controller
 * @memberof controllers
 * @class
 * @classdesc A user controller with methods to manage users.
 */
class UserController extends Controller {

    constructor() {
        super(models.User);
    }

    /**
     * Create a user from the given data.
     * @param {Object} data The data to be set to the user.
     * @return {Promise} A promise which resolves upon creation.
     */
    create(data) {
        // Set/override the group as member.
        data = data || {};
        if (!data.password && typeof data.password !== 'string') {
            return Promise
                .reject(new errors.ValidationError("password invalid."));
        }
        data.group = 'member';
        let user = new models.User(data);

        return hashPassword(data.password)
        .then(result => {
            user.salt = result[0];
            user.hash = result[1];
            return user.save();
        })
        .then(() => {
            return user;
        })
        ;
    }

    /**
     * Update a user with given data.
     * @param {String/ObjectID} id The model id.
     * @param {Object} data The data to be updated.
     * @return {Promise} A promise which resolves upon completion.
     */
    update(id, data) {
        let model;
        return this.Model
        .findById(id)
        .then(_model => {
            if (!_model) {
                throw new errors.ValidationError(
                    "resource not found.");
            }
            model = _model;
            if (data.password) {
                return hashPassword(data.password)
                .then(result => {
                    data.salt = result[0];
                    data.hash = result[1];
                })
                ;
            }
        })
        .then(() => {
            return model.update(data);
        })
        ;
    }

    /**
     * Login/Validate username password.
     * @param {String} username The username.
     * @param {String} password The password.
     * @return {Promise} A promise which resolves with user model upon successful
     * login, otherwsie rejects with an error. NOTE: This does not handle sessions.
     */
    login(username, password) {
        // Set/override the group as member.
        let user = null;
        return models.User
        .findByKey('username', username)
        .then(_user => {
            user = _user;
            if (!user) {
                throw new errors.ValidationError("Invalid credentials.");
            }
            return hashPassword(password, _user.salt);
        })
        .then(result => {
            if (result[1] !== user.hash) {
                throw new errors.ValidationError("Invalid credentials.");
            }
            return user;
        })
        ;
    }

    /**
     * Check if user has permission for the verb(task) on a given noun(module).
     * @param {String} userid The user id for which permission to be checked.
     * @param {String} noun The noun or module on which permission to be checked.
     * @param {String} verb The verb or task.
     * @return {Promise} A promise which resolves with a flag indicating the
     * permission.
     */
    hasPermission(userid, noun, verb) {
        return models.User
        .findById(userid)
        .then(user => {
            return user && user.hasPermission(noun, verb);
        })
        ;
    }

}

module.exports = UserController;
