var util = require('util');
var models = require('./../models');
var Controller = require('./controller');


var UserController = function() {
    Controller.call(this, models.User);
};

util.inherits(UserController, Controller);


module.exports = UserController;
