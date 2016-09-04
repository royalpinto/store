var mongodb = require('mongodb');


var Model = function Model(properties) {
    for (var key in properties) {
        if (key === undefined) {
            continue;
        }
        this[key] = properties[key];
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
    this.collectionName = this.name.toLowerCase();
    this.collection = this.db.collection(this.collectionName);
    var ModelClass = this;
    for (key in schema) {
        if (key === undefined) {
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
    if (!(_id instanceof mongodb.ObjectID)) {
        _id = new mongodb.ObjectID(_id);
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

Model.find = function(query) {
    var ModelClass = this;
    return ModelClass.collection
    .find(query)
    ;
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
    ;
};

Model.prototype.update = function(properties) {
    var model = this;
    var collection = this.constructor.collection;
    return collection.updateOne({
        _id: model._id,
    }, {
        $set: properties,
    })
    ;
};

Model.prototype.remove = function() {
    var model = this;
    var collection = this.constructor.collection;
    return collection.deleteOne({_id: model._id});
};

Model.prototype.validate = function() {
    var model = this;
    var schema = this.constructor._schema;
    return new Promise(function(resolve, reject) {
        var key;
        var errors = [];
        for (key in schema) {
            if (key === undefined) {
                continue;
            }
            var propertySchema = schema[key];
            var property = model[key];
            for (var validatorIndex in propertySchema.validations) {
                if (validatorIndex === undefined) {
                    continue;
                }
                var validator = propertySchema.validations[validatorIndex];

                // Cast it, if there is cast specified.
                if (propertySchema.cast) {
                    property = propertySchema.cast(property);
                }

                var result = validator.fn(property, key);
                if (result) {
                    errors.push(result);
                }
            }
        }
        if (errors.length > 0) {
            reject(errors);
        } else {
            resolve();
        }
    });
};

Model.prototype.toObject = function() {
    var object = {};
    var model = this;
    var schema = model.constructor._schema;
    var key;
    for (key in schema) {
        if (key === undefined) {
            continue;
        }
        var propertySchema = schema[key];
        var value = model[key];
        if (propertySchema.cast) {
            value = propertySchema.cast(value);
        }
        object[key] = value;
    }
    return object;
};

Model.prototype.toJSON = function() {
    var user = this.toObject();
    return user;
};


module.exports = Model;
