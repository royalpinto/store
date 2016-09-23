var util = require('util');
var Model = require('./model');
var validators = require('./validators');

var schema = {
    name: {
        type: String,
        validations: [{
            fn: validators.string(5, 255),
        }],
    },
    code: {
        type: String,
        unique: true,
        validations: [{
            fn: validators.string(5, 255),
        }],
    },
    price: {
        type: Number,
        validations: [{
            // For now let's not allow price more than 1million.
            // Later this can be removed based on the requirement.
            fn: validators.number(1, 1000000),
        }],
    },
    quantity: {
        type: Number,
        validations: [{
            fn: validators.number(0),
        }],
    },
    category: {
        type: String,
        validations: [],
    },
    brand: {
        type: String,
        validations: [],
    },
    description: {
        type: String,
        validations: [{
            fn: validators.string(5, 1023),
        }],
    },
};

var Product = function Product(properties) {
    Model.call(this, properties);
};


util.inherits(Product, Model);
Object.assign(Product, Model);

Product.setSchema(schema);


module.exports = Product;
