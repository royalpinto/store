/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var controller;


describe('User(Controller):', function() {
    before(function(done) {
        mongodb.MongoClient.connect(config.db.uri)
        .then(function(db) {
            return models.init(db);
        })
        .then(function() {
            controller = require('./../../controllers/user');
            done();
        })
        .catch(done)
        ;
    });

    var cleanCollection = function(done) {
        Promise.all([
            models.db.collection(models.User.collectionName).removeMany(),
            models.db.collection(models.Permission.collectionName).removeMany(),
        ])
        .then(function() {
            done();
        })
        ;
    };

    beforeEach(cleanCollection);
    afterEach(cleanCollection);

    var payload = {
        name: "Lohith Royal Pinto",
        email: "royalpinto@gmail.com",
        username: "royalpinto",
        password: "password",
        group: "member",
    };

    it('It should fetch a User', function(done) {
        var user = new models.User(payload);

        user.save()
        .then(function() {
            return controller.getById(user._id);
        })
        .then(function(user) {
            chai.assert.instanceOf(user, Object);
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });

    it('It should remove a User', function(done) {
        var user = new models.User(payload);

        user.save()
        .then(function() {
            return controller.remove(user._id);
        })
        .then(function() {
            return models.User.findById(user._id);
        })
        .then(function(user) {
            chai.assert.isNull(user);
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });

    it('It should fetch users', function(done) {
        var users = [];
        var i;
        for (i = 0; i < 10; i++) {
            var user = new models.User(payload);
            // This is required as username is unique.
            user.username += i;
            users.push(user.save());
        }

        Promise.all(users)
        .then(function() {
            return controller.get({}, 2, 4, {});
        })
        .then(function(users) {
            chai.assert.strictEqual(users.count, 10);
            chai.assert.isArray(users.data);
            chai.assert.strictEqual(users.data.length, 2);
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });
});
