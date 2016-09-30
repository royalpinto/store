'use strict';


const util = require('util');
const mongodb = require('mongodb');
const Model = require('./model');
const Product = require('./product');
const CartItem = require('./cartitem');
const validators = require('./validators');


const schema = {
    userId: {
        type: mongodb.ObjectID,
        unique: true,
        validations: [{
            fn: validators.objectID(true),
        }],
    },
    items: {
        type: Array,
        validations: [{
            fn: (items, key) => {
                return new Promise((resolve, reject) => {
                    if (!(items instanceof Array)) {
                        return reject(util.format("%s is invalid.", key));
                    }
                    let validators = [];
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i];
                        if (!(item instanceof CartItem)) {
                            item = items[i] = new CartItem(item);
                        }
                        validators.push(item.validate());
                    }
                    Promise.all(validators)
                    .then(() => {
                        return items;
                    })
                    .then(resolve)
                    .catch(error => {
                        reject(error.error);
                    })
                    ;
                });
            },
        }],
    },
};

/**
 * Initialize a cart with given properties.
 * @param {Object} [properties={}] The properties to be set to the cart.
 * @param {String/ObjectId} [properties.userId] The unique user id.
 * @param {Array} [properties.items] An array of CartItem instances.
 * @class
 * @extends models.Model
 * @memberof models
 * @classdesc Instances of the Cart class represent a single user cart document.
 */
class Cart extends Model {

    /**
     * Fetch products from the cart items.
     * @return {Promise} A promise which resolves with list of `Product`s upon success
     * and rejects with an error upon failure.
     */
    getProducts() {
        let productIds = this.items.map(item => {
            return item.productId;
        })
        ;
        return Product.collection.find({
            _id: {
                $in: productIds,
            },
        })
        .toArray()
        .then(docs => {
            return docs.map(doc => {
                return new Product(doc);
            });
        })
        ;
    }

}


Cart.setSchema(schema);


module.exports = Cart;
