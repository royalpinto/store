var util = require('util');
var mongodb = require('mongodb');
var Model = require('./model');
var validators = require('./validators');


var schema = {
    productId: {
        type: mongodb.ObjectID,
        validations: [{
            fn: validators.objectID(true),
        }],
    },
    quantity: {
        type: Number,
        validations: [{
            fn: validators.number(1),
        }],
    },
};

/**
 * Initialize a single cart item.
 * @param {Object} [properties={}] The properties to be set to the cartitem.
 * @param {String/ObjectID} [properties.productId] The product id.
 * @param {Number} [properties.quantity] The product quantity.
 * @class
 * @extends models.Model
 * @memberof models
 * @classdesc Instances of the CartItem class represent a single cart item.
 * This should be used as a sub document of Cart class and not as a main document.
 */
var CartItem = function CartItem(properties) {
    Model.call(this, properties);
};

util.inherits(CartItem, Model);
Object.assign(CartItem, Model);

CartItem.setSchema(schema);


module.exports = CartItem;
