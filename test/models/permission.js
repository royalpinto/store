/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
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

    it("it should add/set permission.", function(done) {
        models.Permission.add('admin', 'project', 'readwrite')
        .then(function() {
            return models.Permission.collection
            .find({
                group: "admin",
                noun: "project",
                verb: "readwrite",
            })
            .count();
        })
        .then(function(count) {
            chai.assert.strictEqual(count, 1);
            done();
        })
        .catch(done)
        ;
    });
});
