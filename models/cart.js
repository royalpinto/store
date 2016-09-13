var util = require('util');
var mongodb = require('mongodb');
var Model = require('./model');
var Product = require('./product');
var CartItem = require('./cartitem');
var validators = require('./validators');


var schema = {
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
            fn: function(items, key) {
                return new Promise(function(resolve, reject) {
                    if (!(items instanceof Array)) {
                        return reject(util.format("%s is invalid.", key));
                    }
                    var i;
                    var validators = [];
                    for (i = 0; i < items.length; i++) {
                        var item = items[i];
                        if (!(item instanceof CartItem)) {
                            item = items[i] = new CartItem(item);
                        }
                        validators.push(item.validate());
                    }
                    Promise.all(validators)
                    .then(function() {
                        return items;
                    })
                    .then(resolve)
                    .catch(function(error) {
                        reject(error.error);
                    })
                    ;
                });
            },
        }],
    },
};

var Cart = function Cart(properties) {
    Model.call(this, properties);
};

util.inherits(Cart, Model);
Object.assign(Cart, Model);

Cart.setSchema(schema);

Cart.prototype.getProducts = function() {
    var productIds = this.items.map(function(item) {
        return item.productId;
    })
    ;
    return Product.collection.find({
        _id: {
            $in: productIds,
        },
    })
    .toArray()
    .then(function(docs) {
        return docs.map(function(doc) {
            return new Product(doc);
        });
    })
    ;
};


module.exports = Cart;
