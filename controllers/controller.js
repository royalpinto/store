/**
 * @module controllers
 * @namespace controllers
 */


var errors = require('./../errors');

/**
 * Initialize a controller.
 * @param {models.Model} Model The model on which controller should act.
 * @class
 * @memberof controllers
 * @classdesc A base controller class with very high level common methods.
 */
var Controller = function(Model) {
    this.Model = Model;
};

/**
 * Create a model from the given data.
 * @param {Object} data The data to be set to the model.
 * @return {Promise} A promise which resolves upon model creation and rejects upon failure.
 */
Controller.prototype.create = function(data) {
    var model = new this.Model(data);
    return model.save()
    .then(function() {
        return model;
    });
};

/**
 * Fetch a model for the given id.
 * @param {String/ObjectID} id The model id.
 * @return {Promise} A promise which resolves with the retrived model.
 */
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

/**
 * Fetch models for the given input.
 * @param {Query} query Query according to the mongodb native nodejs driver spec.
 * @param {Number} limit Limit by number of  models to be fetched.
 * @param {Number} skip Skip number of models to be fetched.
 * @param {Order} order Order according to the mongodb native nodejs driver spec.
 * @return {Promise} A promise which resolves with the retrived models and count.
 */
Controller.prototype.get = function(query, limit, skip, order) {
    return this.Model.findAndCount(query, limit, skip, order);
};

/**
 * Update a model.
 * @param {String/ObjectID} id The model id.
 * @param {Object} data The data to be updated.
 * @return {Promise} A promise which resolves upon completion.
 */
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

/**
 * Remove a model.
 * @param {String/ObjectID} id The model id.
 * @return {Promise} A promise which resolves upon completion.
 */
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
