var express = require('express');
var router = new express.Router();
var Cart = require('./../models/cart');
var CartItem = require('./../models/cartitem');
var Product = require('./../models/product');
var roles = require('./../roles');


router.use('/items/*/',
    roles.authorize('cart', '*'),
    function(req, res, next) {
        Cart.findOne({
            userId: req.user._id,
        })
        .then(function(cart) {
            req.cart = cart;
            next();
        })
        .catch(function(err) {
            next(err);
        })
        ;
    }
);


router.post('/items/', function(req, res, next) {
    var cart = req.cart;
    Product.findById(req.body.productId)
    .then(function(product) {
        cart.items.push(new CartItem({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: req.body.quantity,
        }));
        return cart.save();
    })
    .then(function() {
        res.status(204).send();
    })
    .catch(function(err) {
        next(err);
    })
    ;
});


router.get('/items/', function(req, res) {
    res.json(req.cart.items);
});


router.get('/items/:_id/', function(req, res) {
    var item = req.cart.items.id(req.params._id);
    if (!item) {
        return res.status(404).send("Not found");
    }
    res.json(item);
});


router.put('/items/:_id/', function(req, res, next) {
    var cart = req.cart;
    var item = cart.items.id(req.params._id);
    if (!item) {
        return res.status(404).send("Not found");
    }

    item.quantity = req.body.quantity;
    cart.save(function(err) {
        if (err) {
            return next(err);
        }
        res.status(204).send();
    });
});


router.delete('/items/:_id/', function(req, res, next) {
    var cart = req.cart;
    var item = cart.items.id(req.params._id);
    if (!item) {
        return res.status(404).send("Not found");
    }

    item.remove();
    cart.save(function(err) {
        if (err) {
            return next(err);
        }
        res.status(204).send();
    });
});


module.exports = router;
