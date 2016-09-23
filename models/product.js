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
    features: {
        type: Array,
        validations: [{
            fn: function(data, key) {
                var featureValidator = validators.string(5);
                return new Promise(function(resolve, reject) {
                    if (!data) {
                        return resolve(null);
                    }

                    if (!(data instanceof Array)) {
                        return reject(util.format('%s is invalid.', key));
                    }

                    var validators = [];
                    for (var index = 0; index < data.length; index++) {
                        var value = data[index];
                        validators.push(featureValidator(value,
                            util.format('%s[%d]', key, index)));
                    }
                    Promise.all(validators)
                    .then(function() {
                        return;
                    })
                    .then(resolve)
                    .catch(reject)
                    ;
                });
            },
        }],
    },
    imgsrc: {
        type: String,
    },
};

var Product = function Product(properties) {
    Model.call(this, properties);
};


util.inherits(Product, Model);
Object.assign(Product, Model);

Product.setSchema(schema);


module.exports = Product;
