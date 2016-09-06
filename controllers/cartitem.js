var util = require('util');
var models = require('./../models');
var errors = require('./../errors');
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

CartController.prototype.create = function(userId, productId, quantity) {
    var cart;
    return models.Cart
    .findByKey('userId', userId)
    .then(function(_cart) {
        if (_cart) {
            cart = _cart;
            return;
        }
        cart = new models.Cart({
            userId: userId,
            items: [],
        });
        return cart.save();
    })
    .then(function() {
        if (cart.items.filter(function(item) {
            return item.productId.toString() === productId;
        }).length > 0) {
            throw new errors.ValidationError("projectId already added.");
        }
        return models.Product.findById(productId);
    })
    .then(function(product) {
        if (!product) {
            throw new errors.ValidationError("projectId invalid.");
        }
        if (product.quantity < quantity) {
            throw new errors
                .ValidationError("quantity is greater than available.");
        }
        cart.items.push(new models.CartItem({
            productId: productId,
            quantity: quantity,
        }));
        return cart.save();
    })
    ;
};


module.exports = new CartController();
