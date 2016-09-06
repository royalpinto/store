var util = require('util');
var models = require('./../models');
var Controller = require('./controller');


var CartController = function() {
    Controller.call(this, models.Cart);
};

util.inherits(CartController, Controller);


module.exports = new CartController();
