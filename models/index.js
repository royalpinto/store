/**
 * @module models
 * @namespace models
 */

var fs = require('fs');
var path = require('path');
var models = {};
var modelList = [];
var dbDefereds = [];


var files = fs.readdirSync(__dirname);
for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (/^(?!(model|index|validators))\w+.js$/i.test(file)) {
        var model = require(path.join(__dirname, file));
        models[model.name] = model;
        modelList.push(model);
    }
}


/**
 * Initialize the models.
 * This has to be called before making queries using model classes.
 * @param {Object} db The mongodb database connection instance.
 * @return {Promise} A promise which resolves upon initialization and rejects
 * upon failure.
 * @memberof models
 */
models.init = function(db) {
    for (var i = 0; i < dbDefereds.length; i++) {
        var resolve = dbDefereds[i];
        resolve(db);
    }

    return new Promise(function(resolve, reject) {
        models.db = db;
        var initPromises = [];
        for (var i = 0; i < modelList.length; i++) {
            var model = modelList[i];
            initPromises.push(model.init(db));
        }

        return Promise.all(initPromises)
        .then(resolve)
        .catch(reject)
        ;
    });
};


/**
 * Get the db connection instance.
 * This is usefull for modules which requires db promises.
 * @return {Promise} A promise which resolves with db connection instance
 * (Promise will be resolved only after models.init is invoked).
 * @memberof models
 */
models.getDB = function() {
    return new Promise(function(resolve) {
        if (models.db) {
            return resolve(models.db);
        }
        dbDefereds.push(resolve);
    });
};


module.exports = models;
