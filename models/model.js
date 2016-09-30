'use strict';


const util = require('util');
const mongodb = require('mongodb');
const errors = require('./../errors');


const refactorError = error => {
    if (error.code === 11000) {
        let regex = /index:\s*(?:.+?\.\$)?(.*?)\s*dup/;
        let exec = regex.exec(error.message);
        error = new errors.Conflict(
            util.format("%s already present.", exec[1])
        );
    }
    return error;
};


/**
 * Initialize a model with given properties.
 * @param {Object} [properties={}] The properties to be set to the model.
 * @class
 * @memberof models
 * @classdesc Instances of the Model class represent a single database document.
 */
class Model {

    constructor(properties) {
        let schema = this.constructor._schema;
        for (let key in properties) {
            if (properties.hasOwnProperty(key)) {
                let value = properties[key];
                let propertySchema = schema[key];
                if (!propertySchema) {
                    continue;
                }

                this[key] = value;
            }
        }
    }

    /**
     * Set schema to be used for the Model.
     * @param {Schema.<fieldname, config>} schema The schema to used for the Model.
     * @param {String} fieldname The fieldname.
     * @param {Object} config The configuration for the schema field.
     * @param {Function} config.type The type of the schema field.
     * @param {Boolean} config.unique A flag to consider field to be unique.
     * @param {Array} config.validations An array of validators.
     * Every validator object should have fn property
     * (a function which recieves fieldname and value as input and returns `Promise`
     * which resolves with an optional casted value if
     * validation is success, otherwise rejects with an error message.)
     */
    static setSchema(schema) {
        schema._id = {type: mongodb.ObjectID};
        this._schema = schema;
    }

    /**
     * Init model with given db instance, set indexes and references.
     * @param {Object} db The mongodb database instance.
     * @return {Promise} A promise that resolves if everything goes good.
     */
    static init(db) {
        let indexes = [];
        let schema = this._schema;
        this.db = db;
        let collectionName = this.name.toLowerCase();
        this.collection = this.db.collection(collectionName);
        let ModelClass = this;
        for (let key in schema) {
            if (schema.hasOwnProperty(key)) {
                let property = schema[key];
                if (!property.unique) {
                    continue;
                }

                let index = {
                    name: key,
                    unique: true,
                    key: {},
                };
                index.key[key] = 1;
                indexes.push(index);
            }
        }

        return new Promise((resolve, reject) => {
            if (indexes.length > 0) {
                ModelClass.collection.createIndexes(indexes)
                .then(resolve)
                .catch(reject);
            } else {
                resolve();
            }
        });
    }

    /**
     * Find model by the given id.
     * @param {ObjectID/String} _id _id of the model.
     * @return {Promise} A promise that returns a model or null if resolved,
     * or an Error if rejected.
     */
    static findById(_id) {
        let ModelClass = this;

        let propertySchema = ModelClass._schema._id;
        if (!(_id instanceof propertySchema.type)) {
            _id = propertySchema.type(_id);
        }
        return ModelClass.collection
        .findOne({_id: _id})
        .then(response => {
            return response ? new ModelClass(response) : null;
        })
        ;
    }

    /**
     * Find a model by the given key and value.
     * @param {String} key The key.
     * @param {Object} value The value.
     * @return {Promise} A promise that returns a model or null if resolved,
     * or an Error if rejected.
     */
    static findByKey(key, value) {
        let ModelClass = this;
        let query = {};
        let propertySchema = ModelClass._schema[key];
        if (!(value instanceof propertySchema.type)) {
            value = propertySchema.type(value);
        }
        query[key] = value;
        return ModelClass.collection
        .findOne(query)
        .then(response => {
            return response ? new ModelClass(response) : null;
        })
        ;
    }

    /**
     * Find a model by the given query.
     * @param {Query} query Query according to the mongodb native nodejs driver spec.
     * @return {Promise} A promise that returns a model or null if resolved,
     * or an Error if rejected.
     */
    static findOne(query) {
        let ModelClass = this;
        return ModelClass.collection
        .findOne(query)
        .then(response => {
            return response ? new ModelClass(response) : null;
        })
        ;
    }

    /**
     * Find models and total count(without limit/skip) for the given query, limit,
     * skip and order.
     * @param {Query} query Query according to the mongodb native nodejs driver spec.
     * @param {Number} limit Limit by number of  models to be fetched.
     * @param {Number} skip Skip number of models to be fetched.
     * @param {Order} order Order according to the mongodb native nodejs driver spec.
     * This will be applied before applying the limit/skip parameters.
     * @return {Promise} A promise that returns models and count if resolved,
     * or an Error if rejected.
     */
    static findAndCount(query, limit, skip, order) {
        let ModelClass = this;
        return new Promise((resolve, reject) => {
            let cursor = ModelClass.collection
            .find(query)
            .sort(order || {})
            .limit(limit || 0)
            .skip(skip || 0)
            ;

            Promise.all([
                cursor.count(),
                cursor.toArray(),
            ])
            .then(values => {
                resolve({
                    count: values[0],
                    data: values[1].map(value => {
                        return new ModelClass(value);
                    }),
                });
            })
            .catch(reject)
            ;
        });
    }

    /**
     * Validate a given field specified by a key and value.
     * @param {String} key The key.
     * @param {Object} value The value.
     * @return {Promise} A promise that resolves if field passes through all the
     * validations, otherwise rejects with a `ValidationError`.
     */
    static validateFiled(key, value) {
        let schema = this._schema;
        let propertySchema = schema[key];
        let validations = propertySchema.validations;
        let validators = [];
        let validationSuccess = _value => {
            value = _value || value;
        };
        for (let i = 0; i < (validations || []).length; i++) {
            let validation = validations[i];
            validators.push(validation.fn(value, key).then(validationSuccess));
        }
        return Promise.all(validators)
        .then(() => {
            return value;
        });
    }

    /**
     * Save model (If model._id is not set, create a new model otherwise update existing)
     * @return {Promise} A promise that resolves if everything goes good.
     */
    save() {
        let model = this;
        let collection = this.constructor.collection;

        return this.validate()
        .then(() => {
            // If it's an existing document, update.
            if (model._id) {
                return collection.updateOne({
                    _id: model._id,
                }, {
                    $set: model.toObject(),
                });
            }

            // otherwise update.
            return collection
            .insertOne(model.toObject())
            .then(response => {
                model._id = response.insertedId;
            });
        })
        .catch(error => {
            throw refactorError(error);
        })
        ;
    }

    /**
     * Update model with given fields.
     * @param {Obejct} properties The properties (according to the schema) to be updated.
     * @return {Promise} A promise that resolves if everything goes good.
     */
    update(properties) {
        let model = this;
        let ModelClass = this.constructor;
        let schema = ModelClass._schema;
        let data = {};
        let count = 0;
        let validators = [];
        for (let key in properties) {
            if (properties.hasOwnProperty(key)) {
                let value = properties[key];
                let propertySchema = schema[key];
                if (!propertySchema) {
                    continue;
                }

                validators.push(ModelClass.validateFiled(key, value));
                data[key] = value;
                count++;
            }
        }

        if (count === 0) {
            return Promise.resolve();
        }

        return Promise
        .all(validators)
        .then(() => {
            return model.constructor.collection
            .updateOne({
                _id: model._id,
            }, {
                $set: data,
            });
        })
        .then(() => {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    model[key] = data[key];
                }
            }
        })
        .catch(error => {
            throw refactorError(error);
        })
        ;
    }

    /**
     * Remove a model.
     * @return {Promise} A promise that resolves if everything goes good.
     */
    remove() {
        let model = this;
        let collection = this.constructor.collection;
        return collection.deleteOne({_id: model._id});
    }

    /**
     * Validate model.
     * @return {Promise} A promise that resolves if model passes through all the
     * validations, otherwise rejects with a `ValidationError`.
     */
    validate() {
        let model = this;
        let ModelClass = this.constructor;
        let schema = ModelClass._schema;
        return new Promise((resolve, reject) => {
            let error = null;
            let validators = [];
            for (let key in schema) {
                if (schema.hasOwnProperty(key)) {
                    let value = model[key];
                    validators.push(
                        ModelClass
                        .validateFiled(key, value)
                        .then(_value => {
                            model[key] = _value;
                        })
                    );
                }
            }
            Promise.all(validators)
            .then(resolve)
            .catch(result => {
                error = new errors.ValidationError(result);
                reject(error);
            });
        });
    }

    /**
     * Convert Model class instance to a plain JavaScript Object.
     * @return {Object} A plain JavaScript object.
     */
    toObject() {
        let object = {};
        let model = this;
        let schema = model.constructor._schema;
        for (let key in schema) {
            if (schema.hasOwnProperty(key)) {
                object[key] = model[key];
            }
        }
        return object;
    }

    /**
     * Convert Model class instance to a plain JavaScript Object.
     * This method will be invoked by the serializers like JSON.stringify etc.
     * @return {Object} A plain JavaScript object.
     */
    toJSON() {
        let model = this.toObject();
        return model;
    }

}


module.exports = Model;
