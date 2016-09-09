var crypto = require('crypto');
var models = require('./../models');
var errors = require('./../errors');


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

var loginUser = function(username, password) {
    // Set/override the group as member.
    var user = null;
    return models.User
    .findByKey('username', username)
    .then(function(_user) {
        user = _user;
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

var registerUser = function(data) {
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

var hasPermission = function(userid, noun, verb) {
    return models.User
    .findById(userid)
    .then(function(user) {
        return user.hasPermission(noun, verb);
    })
    ;
};

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
    hasPermission: hasPermission,
};
