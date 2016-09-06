var util = require('util');
var mongodb = require('mongodb');
var Model = require('./model');
var CartItem = require('./cartitem');


var schema = {
    userId: {
        type: mongodb.ObjectID,
        unique: true,
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
                            return reject(util
                                .format("%s[%d] is invalid.", key, i));
                        }
                        validators.push(item.validate());
                    }
                    Promise.all(validators)
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


module.exports = Cart;
