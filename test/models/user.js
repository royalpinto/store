/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var errors = require('./../../errors');


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
            models.User.collection.removeMany(),
            models.Permission.collection.removeMany(),
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
        group: "member",
    };

    it('It should have all model attributes', function(done) {
        chai.assert.equal(models.User.collection.collectionName, 'user');
        done();
    });

    it('It should instantiate a User model', function(done) {
        var user = new models.User(payload);

        // Check if fields are assigned.
        for (var key in payload) {
            if (key === undefined) {
                continue;
            }
            chai.assert.equal(user[key], payload[key]);
        }
        done();
    });

    it('It should fail the validation.', function(done) {
        var user = new models.User();
        user.validate()
        .then(function() {
            chai.assert.fail(0, 1, 'Validation should have failed.');
            done();
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError,
                "Validation should return an array.");
            done();
        })
        .catch(function(errors) {
            done(errors);
        })
        ;
    });

    it('It should pass the validation.', function(done) {
        var user = new models.User(payload);
        user.validate()
        .then(function() {
            done();
        })
        .catch(function() {
            chai.assert.fail(0, 1, 'Validation should have passed.');
            done();
        })
        .catch(function(e) {
            done(e);
        })
        ;
    });

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
        .then(function(user) {
            chai.assert.isOk(user, "User find by id retrived null.");
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
            return user.update({name: "Royal Pinto"});
        })
        .then(function() {
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
            return user.remove();
        })
        .then(function() {
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });

    it('It should not have user permission', function(done) {
        var user = new models.User(payload);

        user.save()
        .then(function() {
            return user.hasPermission('projects', 'create');
        })
        .then(function(has) {
            chai.assert.isNotOk(has, "Expected hasPermission to be false.");
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });

    it('It should set the user permission', function(done) {
        var user = new models.User(payload);

        user.save()
        .then(function() {
            return models.Permission.add('member', 'projects', 'create');
        })
        .then(function() {
            return user.hasPermission('projects', 'create');
        })
        .then(function(has) {
            chai.assert.isOk(has, "Expected hasPermission to be true.");
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });

    it('It should unset the user permission', function(done) {
        var user = new models.User(payload);

        user.save()
        .then(function() {
            return models.Permission.add('member', 'projects', 'create');
        })
        .then(function() {
            return user.hasPermission('projects', 'create');
        })
        .then(function(has) {
            chai.assert.isOk(has, "Expected hasPermission to be true.");
            return models.Permission.remove('member', 'projects', 'create');
        })
        .then(function() {
            return user.hasPermission('projects', 'create');
        })
        .then(function(has) {
            chai.assert.isNotOk(has, "Expected hasPermission to be false.");
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
            return models.User.findAndCount({}, 5, 3);
        })
        .then(function(result) {
            chai.assert.strictEqual(result.count, 10);
            chai.assert.isArray(result.data);
            chai.assert.strictEqual(result.data.length, 5);
            done();
        })
        .catch(function(err) {
            done(err);
        })
        ;
    });
});
