/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');


describe('User(Model):', function() {
    before(function(done) {
        mongodb.MongoClient.connect(config.db.uri, function(err, db) {
            if (err) {
                console.error("Failed to connect to the db.");
            } else {
                models.init(db)
                .then(function() {
                    done();
                })
                .catch(console.err)
                ;
            }
        });
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
    };


    it('It should create a User', function(done) {
        var user = new models.User(payload);

        chai.assert.equal(user.name, payload.name);

        user.save()
        .then(function() {
            chai.assert.isOk(user._id, "User creation hasn't created the id.");
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });

    it('It should fetch a User by id', function(done) {
        var user = new models.User(payload);

        user.save()
        .then(function() {
            return models.User.findById(user._id);
        })
        .then(function(user) {
            chai.assert.isOk(user, "User find by id retrived null.");
            chai.assert.instanceOf(user, models.User);
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });

    it('It should fetch a User by username', function(done) {
        var user = new models.User(payload);

        user.save()
        .then(function() {
            return models.User.findByKey('username', user.username);
        })
        .then(function() {
            chai.assert.isOk(user, "User find by id retrived null.");
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });

});
