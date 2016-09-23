/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var errors = require('./../../errors');


describe('User(Model):', function() {
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
        var localpayload = JSON.parse(JSON.stringify(payload));
        localpayload.random = "ABCD";
        var user = new models.User(localpayload);
        // Check if fields are assigned.
        for (var key in localpayload) {
            if (key === undefined) {
                continue;
            } else if (key === "random") { // Random keys should not be applied.
                continue;
            }
            chai.assert.equal(user[key], localpayload[key]);
        }
        done();
    });

    it('It should fail the validation.', function(done) {
        var user = new models.User();
        user.validate()
        .then(function() {
            done('Validation should have failed.');
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            done();
        })
        .catch(done)
        ;
    });

    it('It should fail the validation with invalid username.', function(done) {
        var user = new models.User(payload);
        user.username = "%7 09";
        user.validate()
        .then(function() {
            done('Validation should have failed.');
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            done();
        })
        .catch(done)
        ;
    });

    it('It should serialize user with only exposable fields.', function(done) {
        var user = new models.User(payload);
        user.salt = "dummysalt";
        user.salt = "dummyhash";
        user.save()
        .then(function() {
            var userjson = JSON.parse(JSON.stringify(user));
            chai.assert.equal(userjson._id, user._id);
            chai.assert.strictEqual(userjson.name, user.name);
            chai.assert.strictEqual(userjson.username, user.username);
            chai.assert.strictEqual(userjson.group, user.group);
            chai.assert.isUndefined(userjson.salt);
            chai.assert.isUndefined(userjson.hash);
            done();
        })
        .catch(done)
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
            return models.User.collection.findOne({
                username: user.username,
            });
        })
        .then(function(userjson) {
            chai.assert.equal(userjson._id.toString(), user._id.toString());
            chai.assert.strictEqual(userjson.name, user.name);
            chai.assert.strictEqual(userjson.username, user.username);
            chai.assert.strictEqual(userjson.group, user.group);
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
        .then(function(actualuser) {
            chai.assert.isOk(actualuser);
            chai.assert.instanceOf(actualuser, models.User);
            chai.assert.strictEqual(actualuser.name, user.name);
            chai.assert.strictEqual(actualuser.username, user.username);
            chai.assert.strictEqual(actualuser.group, user.group);
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
        .then(function(actualuser) {
            chai.assert.isOk(actualuser);
            chai.assert.instanceOf(actualuser, models.User);
            chai.assert.strictEqual(actualuser.name, user.name);
            chai.assert.strictEqual(actualuser.username, user.username);
            chai.assert.strictEqual(actualuser.group, user.group);
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
            return models.User.collection.findOne({
                username: user.username,
            });
        })
        .then(function(userjson) {
            chai.assert.strictEqual(userjson.name, "Royal Pinto");
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
            return models.User.collection.findOne({
                username: user.username,
            });
        })
        .then(function(doc) {
            chai.assert.isNull(doc);
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
            return user.hasPermission('products', 'create');
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
            return models.Permission.add('member', 'products', 'create');
        })
        .then(function() {
            return user.hasPermission('products', 'create');
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
            return models.Permission.add('member', 'products', 'create');
        })
        .then(function() {
            return user.hasPermission('products', 'create');
        })
        .then(function(has) {
            chai.assert.isOk(has, "Expected hasPermission to be true.");
            return models.Permission.remove('member', 'products', 'create');
        })
        .then(function() {
            return user.hasPermission('products', 'create');
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
