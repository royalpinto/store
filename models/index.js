'use strict';


/**
 * @module models
 * @namespace models
 */

const fs = require('fs');
const path = require('path');
const models = {};
const modelList = [];
const dbDefereds = [];


const files = fs.readdirSync(__dirname);
for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (/^(?!(model|index|validators))\w+.js$/i.test(file)) {
        let model = require(path.join(__dirname, file));
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
models.init = db => {
    for (let i = 0; i < dbDefereds.length; i++) {
        let resolve = dbDefereds[i];
        resolve(db);
    }

    return new Promise((resolve, reject) => {
        models.db = db;
        let initPromises = [];
        for (let i = 0; i < modelList.length; i++) {
            let model = modelList[i];
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
models.getDB = () => {
    return new Promise(resolve => {
        if (models.db) {
            return resolve(models.db);
        }
        dbDefereds.push(resolve);
    });
};


module.exports = models;
