/* global describe, it */

var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');


describe('models(Model):', function() {
    it("It should initiate models.", function(done) {
        models.db = null;
        mongodb.MongoClient.connect(config.db.uri)
        .then(function(db) {
            return models.init(db);
        })
        .then(function() {
            return models.getDB();
        })
        .then(function() {
            done();
        })
        .catch(done)
        ;
    });
});
