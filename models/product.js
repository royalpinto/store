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
        cast: Number.parseFloat,
        validations: [{
            fn: validators.number(1),
        }],
    },
    quantity: {
        type: Number,
        cast: Number.parseInt,
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
};

var Product = function Product(properties) {
    Model.call(this, properties);
};


util.inherits(Product, Model);
Object.assign(Product, Model);

Product.setSchema(schema);


module.exports = Product;
