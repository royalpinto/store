var errors = require('./../errors');

var Controller = function(Model) {
    this.Model = Model;
};

Controller.prototype.create = function(data) {
    var model = new this.Model(data);
    return model.save()
    .then(function() {
        return model;
    });
};

Controller.prototype.getById = function(id) {
    return this.Model
    .findById(id)
    .then(function(model) {
        if (!model) {
            throw new errors.ValidationError(
                "resource not found.");
        }
        return model;
    })
    ;
};

Controller.prototype.get = function(query, limit, skip, order) {
    return this.Model.findAndCount(query, limit, skip, order);
};

Controller.prototype.update = function(id, data) {
    return this.Model
    .findById(id)
    .then(function(model) {
        if (!model) {
            throw new errors.ValidationError(
                "resource not found.");
        }
        return model.update(data);
    })
    ;
};

Controller.prototype.remove = function(id) {
    return this.Model
    .findById(id)
    .then(function(model) {
        if (!model) {
            throw new errors.ValidationError(
                "resource not found.");
        }
        return model.remove();
    })
    ;
};


module.exports = Controller;
