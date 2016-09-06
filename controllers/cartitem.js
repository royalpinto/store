var util = require('util');
var models = require('./../models');
var Controller = require('./controller');


var CartController = function() {
    Controller.call(this, models.Cart);
};

util.inherits(CartController, Controller);

CartController.prototype.get = function(userId) {
    return models.Cart
    .findByKey('userId', userId)
    .then(function(cart) {
        if (cart) {
            return cart.items;
        }
        return [];
    })
    ;
};


module.exports = new CartController();
