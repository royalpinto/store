var models = require('./../models');


var createUser = function(data) {
    // Set/override the group as member.
    data = data || {};
    data.group = 'member';

    var user = new models.User(data);
    return user.save()
    .then(function() {
        return user;
    });
};

var readUser = function(id) {
    return models.User
    .findById(id)
    ;
};

var readUsers = function(query, limit, skip, order) {
    return models.User
    .find(query)
    .sort(order || {})
    .limit(limit)
    .skip(skip || 0)
    .toArray()
    ;
};

var updateUser = function(id, data) {
    // Set/override the group as member.
    data = data || {};
    data.group = 'member';

    return models.User
    .findById(id)
    .then(function(user) {
        return user.update(data);
    });
};

var removeUser = function(id) {
    return models.User
    .findById(id)
    .then(function(user) {
        return user.remove();
    })
    ;
};


module.exports = {
    createUser: createUser,
    readUser: readUser,
    readUsers: readUsers,
    updateUser: updateUser,
    removeUser: removeUser,
};
