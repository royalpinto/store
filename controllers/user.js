var util = require('util');
var models = require('./../models');
var Controller = require('./controller');


var UserController = function() {
    Controller.call(this, models.User);
};

util.inherits(UserController, Controller);

Controller.prototype.create = function() {
    throw new Error("Not allowed, please use auth controller.");
};

Controller.prototype.update = function() {
    throw new Error("Not allowed, please use auth controller.");
};


module.exports = new UserController();
