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

var CartItem = function CartItem(properties) {
    Model.call(this, properties);
};

util.inherits(CartItem, Model);
Object.assign(CartItem, Model);

CartItem.setSchema(schema);


module.exports = CartItem;
