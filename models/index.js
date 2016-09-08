var fs = require('fs');
var path = require('path');
var models = {};
var modelList = [];
var dbDefereds = [];


var files = fs.readdirSync(__dirname);
for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.indexOf('.') !== 0 && file !== 'index.js' &&
            file !== 'validators.js' && file.slice(-3) === '.js') {
        var model = require(path.join(__dirname, file));
        models[model.name] = model;
        modelList.push(model);
    }
}


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


models.getDB = function() {
    return new Promise(function(resolve) {
        if (models.db) {
            return resolve(models.db);
        }
        dbDefereds.push(resolve);
    });
};


module.exports = models;
