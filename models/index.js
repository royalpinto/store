var fs = require('fs');
var path = require('path');
var models = {};


models.init = function(db) {
    return new Promise(function(resolve, reject) {
        models.db = db;
        fs.readdir(__dirname, function(err, files) {
            if (err) {
                return reject(err);
            }
            var initPromises = [];
            files
            .filter(function(file) {
                return ((file.indexOf('.') !== 0) &&
                        (file !== 'index.js') &&
                        (file !== 'validators.js') &&
                        (file.slice(-3) === '.js'));
            })
            .forEach(function(file) {
                var model = require(path.join(__dirname, file));
                models[model.name] = model;
                initPromises.push(model.init(db));
            });

            return Promise.all(initPromises)
            .then(resolve)
            .catch(reject);
        });
    });
};


module.exports = models;
