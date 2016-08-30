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

/**
 * @api {post} /api/cart/items/ Add product to the cart
 * @apiName AddToCart
 * @apiGroup Cart
 *
 * @apiParam {String} productId Product id
 * @apiParam {Number} quantity Quantity
 *
 * @apiSuccess (Success 204) {Header} 204 No Content
 */
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

/**
 * @api {get} /api/cart/items/ Get cart items
 * @apiName GetCartItems
 * @apiGroup Cart
 *
 * @apiSuccess (Success 200) {Object[]} products Products added to the cart
 * @apiSuccess (Success 200) {Number} products.id Cart item id
 * @apiSuccess (Success 200) {String} products.productId Product id
 * @apiSuccess (Success 200) {String} products.name Product name
 * @apiSuccess (Success 200) {Number} products.price Product price
 * @apiSuccess (Success 200) {Number} products.quantity Product quantity
 */
router.get('/items/', function(req, res) {
    res.json(req.cart.items);
});

/**
 * @api {get} /api/cart/items/id/ Get cart item
 * @apiName GetCartItem
 * @apiGroup Cart
 *
 * @apiSuccess (Success 200) {Object[]} products Products added to the cart
 * @apiSuccess (Success 200) {Number} products.id Cart item id
 * @apiSuccess (Success 200) {String} products.productId Product id
 * @apiSuccess (Success 200) {String} products.name Product name
 * @apiSuccess (Success 200) {Number} products.price Product price
 * @apiSuccess (Success 200) {Number} products.quantity Product quantity
 */
router.get('/items/:_id/', function(req, res) {
    var item = req.cart.items.id(req.params._id);
    if (!item) {
        return res.status(404).send("Not found");
    }
    res.json(item);
});

/**
 * @api {put} /api/cart/items/id/ Update product quantity
 * @apiName UpdateCartItem
 * @apiGroup Cart
 *
 * @apiParam {String} quantity Quantity to be updated
 *
 * @apiSuccess (Success 204) {Header} 204 No Content
 */
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

/**
 * @api {delete} /api/cart/items/id/ Delete product from the cart
 * @apiName RemoveFromCart
 * @apiGroup Cart
 *
 * @apiSuccess (Success 204) {Header} 204 No Content
 */
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
