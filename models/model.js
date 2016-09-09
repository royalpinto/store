var util = require('util');
var mongodb = require('mongodb');
var errors = require('./../errors');


var refactorError = function(error) {
    if (error.code === 11000) {
        var regex = /index:\s*(?:.+?\.\$)?(.*?)\s*dup/;
        var exec = regex.exec(error.message);
        error = new errors.ValidationError(
            util.format("%s already present.", exec[1])
        );
    }
    return error;
};


var Model = function Model(properties) {
    var schema = this.constructor._schema;
    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }
        var value = properties[key];
        var propertySchema = schema[key];
        if (!propertySchema) {
            continue;
        }

        this[key] = value;
    }
};

Model.setSchema = function(schema) {
    schema._id = {type: mongodb.ObjectID};
    this._schema = schema;
};

Model.init = function(db) {
    var indexes = [];
    var key;
    var schema = this._schema;
    this.db = db;
    var collectionName = this.name.toLowerCase();
    this.collection = this.db.collection(collectionName);
    var ModelClass = this;
    for (key in schema) {
        if (!schema.hasOwnProperty(key)) {
            continue;
        }

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

Model.findOne = function(query) {
    var ModelClass = this;
    return ModelClass.collection
    .findOne(query)
    .then(function(response) {
        return response ? new ModelClass(response) : null;
    })
    ;
};

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

Model.prototype.update = function(properties) {
    var model = this;
    var ModelClass = this.constructor;
    var schema = ModelClass._schema;
    var data = {};
    var count = 0;
    var validators = [];
    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }
        var value = properties[key];
        var propertySchema = schema[key];
        if (!propertySchema) {
            continue;
        }

        validators.push(ModelClass.validateFiled(key, value));
        data[key] = value;
        count++;
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

Model.prototype.remove = function() {
    var model = this;
    var collection = this.constructor.collection;
    return collection.deleteOne({_id: model._id});
};

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

Model.prototype.validate = function() {
    var model = this;
    var ModelClass = this.constructor;
    var schema = ModelClass._schema;
    return new Promise(function(resolve, reject) {
        var key;
        var error = null;
        var validators = [];
        for (key in schema) {
            if (!schema.hasOwnProperty(key)) {
                continue;
            }
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
        Promise.all(validators)
        .then(resolve)
        .catch(function(result) {
            error = new errors.ValidationError(result);
            reject(error);
        });
    });
};

Model.prototype.toObject = function() {
    var object = {};
    var model = this;
    var schema = model.constructor._schema;
    var key;
    for (key in schema) {
        if (!schema.hasOwnProperty(key)) {
            continue;
        }
        object[key] = model[key];
    }
    return object;
};

Model.prototype.toJSON = function() {
    var model = this.toObject();
    return model;
};


module.exports = Model;
