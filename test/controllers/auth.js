/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var controller = require('./../../controllers/auth');
var errors = require('./../../errors');


describe('CartItem(Controller):', function() {
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
        password: "password",
    };

    it("It should register user", function(done) {
        controller
        .registerUser(payload)
        .then(function(user) {
            chai.assert.isOk(user);
            chai.assert.instanceOf(user, models.User);
            chai.assert.equal(user.username, payload.username);
            done();
        })
        .catch(done)
        ;
    });

    it("It should not register without password", function(done) {
        var localpayload = JSON.parse(JSON.stringify(payload));
        delete localpayload.password;
        controller
        .registerUser(localpayload)
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
        .registerUser(payload)
        .then(function() {
            return controller.loginUser(payload.username, payload.password);
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
});
