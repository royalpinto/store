'use strict';


const util = require('util');
const Model = require('./model');
const validators = require('./validators');

const schema = {
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
            fn: (data, key) => {
                let featureValidator = validators.string(5);
                return new Promise((resolve, reject) => {
                    if (!data) {
                        return resolve(null);
                    }

                    if (!(data instanceof Array)) {
                        return reject(util.format('%s is invalid.', key));
                    }

                    let validators = [];
                    for (let index = 0; index < data.length; index++) {
                        let value = data[index];
                        validators.push(featureValidator(value,
                            util.format('%s[%d]', key, index)));
                    }
                    Promise.all(validators)
                    .then(() => {
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

/**
 * Initialize a product with given properties.
 * @param {Object} [properties={}] The properties to be set to the product.
 * @param {String} [properties.name] Name of the product.
 * @param {String} [properties.code] The unique product code.
 * @param {Number} [properties.price] The product price.
 * @param {Number} [properties.quantity] The product quantity.
 * @param {String} [properties.category] The product category.
 * @param {String} [properties.brand] The product brand.
 * @param {String} [properties.description] The product description.
 * @param {Array} [properties.features] The list of features.
 * @param {String} [properties.imgsrc] The imgsrc of the product.
 * @class
 * @extends models.Model
 * @memberof models
 * @classdesc Instances of the Product class represent a single product db document.
 */
class Product extends Model {

}


Product.setSchema(schema);


module.exports = Product;
