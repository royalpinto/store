var util = require('util');
var Model = require('./model');
var CartItem = require('./cartitem');


var schema = {
    userId: {
        type: String,
        unique: true,
    },
    items: {
        type: Array,
        validations: [{
            fn: function(items, key) {
                if (!(items instanceof Array)) {
                    return util.format("%s is invalid.", key);
                }
                var i;
                for (i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (!(item instanceof CartItem)) {
                        return util.format("%s[%d] is invalid.", key, i);
                    }
                    var r = item.validate();
                    if (r) {
                        return r;
                    }
                }
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
