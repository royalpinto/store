/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var userController = require('./../../controllers/user');


describe('User(Controller):', function() {
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
        group: "member",
    };

    it('It should fail user creation because of validations.', function(done) {
        userController.createUser({
            name: "Lohith Pinto",
        })
        .then(function() {
            chai.assert.fail(0, 1, 'Validation should have failed.');
            done();
        })
        .catch(function(errors) {
            chai.assert.isArray(errors, "Validation should return an array.");
            done();
        })
        .catch(function(e) {
            done(e);
        })
        ;
    });

    it('It should create a User', function(done) {
        userController.createUser(payload)
        .then(function(user) {
            chai.assert.isOk(user._id, "User creation hasn't created the id.");
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });

    it('It should fetch a User', function(done) {
        var user = new models.User(payload);

        user.save()
        .then(function() {
            return userController.readUser(user._id);
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

    it('It should update a User', function(done) {
        var user = new models.User(payload);

        user.save()
        .then(function() {
            return userController.updateUser(user._id, {
                name: "Royal Pinto",
            });
        })
        .then(function() {
            return models.User.findById(user._id);
        })
        .then(function(user) {
            chai.assert.strictEqual(user.name, "Royal Pinto");
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
            return userController.removeUser(user._id);
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
            return userController.readUsers({}, 2, 4, {});
        })
        .then(function(users) {
            chai.assert.isArray(users);
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });
});
