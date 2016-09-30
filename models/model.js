var util = require('util');
var mongodb = require('mongodb');
var errors = require('./../errors');


var refactorError = function(error) {
    if (error.code === 11000) {
        var regex = /index:\s*(?:.+?\.\$)?(.*?)\s*dup/;
        var exec = regex.exec(error.message);
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
var Model = function Model(properties) {
    var schema = this.constructor._schema;
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            var propertySchema = schema[key];
            if (!propertySchema) {
                continue;
            }

            this[key] = value;
        }
    }
};

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
Model.setSchema = function(schema) {
    schema._id = {type: mongodb.ObjectID};
    this._schema = schema;
};

/**
 * Init model with given db instance, set indexes and references.
 * @param {Object} db The mongodb database instance.
 * @return {Promise} A promise that resolves if everything goes good.
 */
Model.init = function(db) {
    var indexes = [];
    var key;
    var schema = this._schema;
    this.db = db;
    var collectionName = this.name.toLowerCase();
    this.collection = this.db.collection(collectionName);
    var ModelClass = this;
    for (key in schema) {
        if (schema.hasOwnProperty(key)) {
            var property = schema[key];
            if (!property.unique) {
                continue;
            }

            var index = {
                name: key,
                unique: true,
                key: {},
            };
            index.key[key] = 1;
            indexes.push(index);
        }
    }

    return new Promise(function(resolve, reject) {
        if (indexes.length > 0) {
            ModelClass.collection.createIndexes(indexes)
            .then(resolve)
            .catch(reject);
        } else {
            resolve();
        }
    });
};

/**
 * Find model by the given id.
 * @param {ObjectID/String} _id _id of the model.
 * @return {Promise} A promise that returns a model or null if resolved,
 * or an Error if rejected.
 */
Model.findById = function(_id) {
    var ModelClass = this;

    var propertySchema = ModelClass._schema._id;
    if (!(_id instanceof propertySchema.type)) {
        _id = propertySchema.type(_id);
    }
    return ModelClass.collection
    .findOne({_id: _id})
    .then(function(response) {
        return response ? new ModelClass(response) : null;
    })
    ;
};

/**
 * Find a model by the given key and value.
 * @param {String} key The key.
 * @param {Object} value The value.
 * @return {Promise} A promise that returns a model or null if resolved,
 * or an Error if rejected.
 */
Model.findByKey = function(key, value) {
    var ModelClass = this;
    var query = {};
    var propertySchema = ModelClass._schema[key];
    if (!(value instanceof propertySchema.type)) {
        value = propertySchema.type(value);
    }
    query[key] = value;
    return ModelClass.collection
    .findOne(query)
    .then(function(response) {
        return response ? new ModelClass(response) : null;
    })
    ;
};

/**
 * Find a model by the given query.
 * @param {Query} query Query according to the mongodb native nodejs driver spec.
 * @return {Promise} A promise that returns a model or null if resolved,
 * or an Error if rejected.
 */
Model.findOne = function(query) {
    var ModelClass = this;
    return ModelClass.collection
    .findOne(query)
    .then(function(response) {
        return response ? new ModelClass(response) : null;
    })
    ;
};

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
Model.findAndCount = function(query, limit, skip, order) {
    var ModelClass = this;
    return new Promise(function(resolve, reject) {
        var cursor = ModelClass.collection
        .find(query)
        .sort(order || {})
        .limit(limit || 0)
        .skip(skip || 0)
        ;

        Promise.all([
            cursor.count(),
            cursor.toArray(),
        ])
        .then(function(values) {
            resolve({
                count: values[0],
                data: values[1].map(function(value) {
                    return new ModelClass(value);
                }),
            });
        })
        .catch(reject)
        ;
    });
};

/**
 * Save model (If model._id is not set, create a new model otherwise update existing)
 * @return {Promise} A promise that resolves if everything goes good.
 */
Model.prototype.save = function() {
    var model = this;
    var collection = this.constructor.collection;

    return this.validate()
    .then(function() {
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
        .then(function(response) {
            model._id = response.insertedId;
        });
    })
    .catch(function(error) {
        throw refactorError(error);
    })
    ;
};

/**
 * Update model with given fields.
 * @param {Obejct} properties The properties (according to the schema) to be updated.
 * @return {Promise} A promise that resolves if everything goes good.
 */
Model.prototype.update = function(properties) {
    var model = this;
    var ModelClass = this.constructor;
    var schema = ModelClass._schema;
    var data = {};
    var count = 0;
    var validators = [];
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];
            var propertySchema = schema[key];
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
    .then(function() {
        return model.constructor.collection
        .updateOne({
            _id: model._id,
        }, {
            $set: data,
        });
    })
    .then(function() {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                model[key] = data[key];
            }
        }
    })
    .catch(function(error) {
        throw refactorError(error);
    })
    ;
};

/**
 * Remove a model.
 * @return {Promise} A promise that resolves if everything goes good.
 */
Model.prototype.remove = function() {
    var model = this;
    var collection = this.constructor.collection;
    return collection.deleteOne({_id: model._id});
};

/**
 * Validate a given field specified by a key and value.
 * @param {String} key The key.
 * @param {Object} value The value.
 * @return {Promise} A promise that resolves if field passes through all the
 * validations, otherwise rejects with a `ValidationError`.
 */
Model.validateFiled = function(key, value) {
    var schema = this._schema;
    var propertySchema = schema[key];
    var validations = propertySchema.validations;
    var validators = [];
    var validationSuccess = function(_value) {
        value = _value || value;
    };
    for (var i = 0; i < (validations || []).length; i++) {
        var validation = validations[i];
        validators.push(validation.fn(value, key).then(validationSuccess));
    }
    return Promise.all(validators)
    .then(function() {
        return value;
    });
};

/**
 * Validate model.
 * @return {Promise} A promise that resolves if model passes through all the
 * validations, otherwise rejects with a `ValidationError`.
 */
Model.prototype.validate = function() {
    var model = this;
    var ModelClass = this.constructor;
    var schema = ModelClass._schema;
    return new Promise(function(resolve, reject) {
        var key;
        var error = null;
        var validators = [];
        for (key in schema) {
            if (schema.hasOwnProperty(key)) {
                var value = model[key];
                (function(key, value) {
                    validators.push(
                        ModelClass
                        .validateFiled(key, value)
                        .then(function(_value) {
                            model[key] = _value;
                        })
                    );
                })(key, value);
            }
        }
        Promise.all(validators)
        .then(resolve)
        .catch(function(result) {
            error = new errors.ValidationError(result);
            reject(error);
        });
    });
};

/**
 * Convert Model class instance to a plain JavaScript Object.
 * @return {Object} A plain JavaScript object.
 */
Model.prototype.toObject = function() {
    var object = {};
    var model = this;
    var schema = model.constructor._schema;
    var key;
    for (key in schema) {
        if (schema.hasOwnProperty(key)) {
            object[key] = model[key];
        }
    }
    return object;
};

/**
 * Convert Model class instance to a plain JavaScript Object.
 * This method will be invoked by the serializers like JSON.stringify etc.
 * @return {Object} A plain JavaScript object.
 */
Model.prototype.toJSON = function() {
    var model = this.toObject();
    return model;
};


module.exports = Model;
