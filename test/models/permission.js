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

    it("it should ignore adding permission, if already added.", function(done) {
        models.Permission.add('admin', 'project', 'readwrite')
        .then(function() {
            return models.Permission.add('admin', 'project', 'readwrite');
        })
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

    it("it should remove permission.", function(done) {
        models.Permission.add('admin', 'project', 'readwrite')
        .then(function() {
            return models.Permission.remove('admin', 'project', 'readwrite');
        })
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
            chai.assert.strictEqual(count, 0);
            done();
        })
        .catch(done)
        ;
    });

    it("it should ignore removing permission, if not already added.",
        function(done) {
            models.Permission.add('admin', 'project', 'readwrite')
            .then(function() {
                return models.Permission
                .remove('admin', 'project', 'readwrite');
            })
            .then(function() {
                return models.Permission
                .remove('admin', 'project', 'readwrite');
            })
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
                chai.assert.strictEqual(count, 0);
                done();
            })
            .catch(done)
            ;
        }
    );

    it("it should check permission already added.",
        function(done) {
            models.Permission.add('admin', 'project', 'readwrite')
            .then(function() {
                return models.Permission
                .check('admin', 'project', 'readwrite');
            })
            .then(function(permit) {
                chai.assert.strictEqual(permit, true);
                return models.Permission
                .remove('admin', 'project', 'readwrite');
            })
            .then(function() {
                return models.Permission
                .check('admin', 'project', 'readwrite');
            })
            .then(function(permit) {
                chai.assert.strictEqual(permit, false);
                done();
            })
            .catch(done)
            ;
        }
    );
});
