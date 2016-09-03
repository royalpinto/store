var crypto = require('crypto');
var models = require('./../models');


var hashPassword = function(password, salt) {
    return new Promise(function(resolve, reject) {
        salt = salt || crypto.randomBytes(16).toString('hex');
        crypto.pbkdf2(password, salt, 100000,
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
            throw new Error("Invalid credentials.");
        }
        return user;
    })
    ;
};

var registerUser = function(data) {
    // Set/override the group as member.
    data = data || {};
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


module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
};
