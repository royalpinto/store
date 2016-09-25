/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var Controller = require('./../../controllers/user');
var controller = new Controller();
var errors = require('./../../errors');


describe('User(Controller):', function() {
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
        password: "password",
        group: "member",
    };

    it("It should register user", function(done) {
        controller
        .create(payload)
        .then(function(user) {
            chai.assert.isOk(user);
            chai.assert.instanceOf(user, models.User);
            chai.assert.equal(user.username, payload.username);
            done();
        })
        .catch(done)
        ;
    });

    it("It should not register without data", function(done) {
        controller
        .create()
        .then(function() {
            done(true);
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error,
                "password invalid.");
            done();
        })
        .catch(done)
        ;
    });

    it("It should not register without password", function(done) {
        var localpayload = JSON.parse(JSON.stringify(payload));
        delete localpayload.password;
        controller
        .create(localpayload)
        .then(function() {
            done("registration should have failed.");
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error,
                "password invalid.");
            done();
        })
        .catch(done)
        ;
    });

    it("It should login user", function(done) {
        controller
        .create(payload)
        .then(function() {
            return controller.login(payload.username, payload.password);
        })
        .then(function(user) {
            chai.assert.isOk(user);
            chai.assert.instanceOf(user, models.User);
            chai.assert.equal(user.username, payload.username);
            done();
        })
        .catch(done)
        ;
    });

    it("It should not login with invalid credentials", function(done) {
        controller
        .create(payload)
        .then(function() {
            return controller.login(payload.username, "nonpassword");
        })
        .catch(function(error) {
            console.log(error);
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error,
                "Invalid credentials.");
            done();
        })
        .catch(done)
        ;
    });

    it("It should check permission", function(done) {
        controller
        .create(payload)
        .then(function(user) {
            return controller.hasPermission(user._id, "product", "write");
        })
        .then(function(permit) {
            chai.assert.strictEqual(permit, false);
            done();
        })
        .catch(done)
        ;
    });

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
