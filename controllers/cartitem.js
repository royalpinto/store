'use strict';


const models = require('./../models');
const errors = require('./../errors');
const Controller = require('./controller');


class CartController extends Controller {

    constructor() {
        super(models.Cart);
    }

    get(userId) {
        let items;
        return models.Cart
        .findByKey('userId', userId)
        .then(cart => {
            if (cart) {
                items = cart.items;
                return cart.getProducts();
            }
            items = [];
            return [];
        })
        .then(products => {
            products.forEach(product => {
                let item = items.find(item => {
                    return product._id.equals(item.productId);
                });
                item.product = product;
            });
            return items;
        })
        ;
    }

    /**
     * Add product to the cart.
     * @param {String} userId The user id.
     * @param {String} productId The id of the product to be added to the cart.
     * @param {Number} quantity The quantity to be added to the cart.
     * @return {Promise} A promise which resolves upon completion.
     */
    create(userId, productId, quantity) {
        let cart;
        return models.Cart
        .findByKey('userId', userId)
        .then(_cart => {
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
        .then(() => {
            if (cart.items.filter(item => {
                return item.productId.equals(productId);
            }).length > 0) {
                throw new errors.Conflict("productId already added.");
            }
            return models.Product.findById(productId);
        })
        .then(product => {
            if (!product) {
                throw new errors.ValidationError("productId invalid.");
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
    }

    /**
     * Update cart quantity.
     * @param {String} userId The user id.
     * @param {String} productId The id of the product for which quantity to be updatd.
     * @param {Number} quantity The quantity to be updated in the cart.
     * @return {Promise} A promise which resolves upon completion.
     */
    update(userId, productId, quantity) {
        let cart;
        let cartItem = null;
        return models.Cart
        .findByKey('userId', userId)
        .then(_cart => {
            if (!_cart) {
                throw new errors.ValidationError(
                    "productId not added to the cart.");
            }
            cart = _cart;
            let i;
            for (i = 0; i < cart.items.length; i++) {
                if (cart.items[i].productId.equals(productId)) {
                    cartItem = cart.items[i];
                    break;
                }
            }
            if (!cartItem) {
                throw new errors.ValidationError(
                    "productId not added to the cart.");
            }
            return models.Product.findById(productId);
        })
        .then(product => {
            if (product.quantity < quantity) {
                throw new errors
                    .ValidationError("quantity is greater than available.");
            }
            cartItem.quantity = quantity;
            return cart.save();
        })
        ;
    }

    /**
     * Remove cart item.
     * @param {String} userId The user id.
     * @param {String} productId The id of the product which has to be removed.
     * @return {Promise} A promise which resolves upon completion.
     */
    remove(userId, productId) {
        let cart;
        let cartItem = null;
        return models.Cart
        .findByKey('userId', userId)
        .then(_cart => {
            if (!_cart) {
                throw new errors.ValidationError(
                    "productId not added to the cart.");
            }
            cart = _cart;
            let i;
            for (i = 0; i < cart.items.length; i++) {
                if (cart.items[i].productId.equals(productId)) {
                    cartItem = cart.items[i];
                    break;
                }
            }
            if (!cartItem) {
                throw new errors.ValidationError(
                    "productId not added to the cart.");
            }
            cart.items.splice(i, 1);
            return cart.save();
        })
        ;
    }

    /**
     * Checkout cart.
     * @param {String} userId The user id.
     * @return {Promise} A promise which resolves upon completion.
     */
    checkout(userId) {
        return models.Cart
        .findByKey('userId', userId)
        .then(cart => {
            if (!cart || cart.items.length === 0) {
                throw new errors.ValidationError(
                    "Nothing is in the cart to checkout.");
            }
            // Proceed for the payment and store the order details.
            cart.items = [];
            return cart.save();
        })
        ;
    }

}


module.exports = CartController;
