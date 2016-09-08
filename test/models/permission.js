/* global describe, before, beforeEach, afterEach */

var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');


describe('Permission(Model):', function() {
    before(function(done) {
        mongodb.MongoClient.connect(config.db.uri)
        .then(function(db) {
            return models.init(db);
        })
        .then(function() {
            done();
        })
        .catch(done)
        ;
    });

    var cleanCollection = function(done) {
        models.Permission.collection.removeMany()
        .then(function() {
            done();
        })
        ;
    };

    beforeEach(cleanCollection);
    afterEach(cleanCollection);
});
