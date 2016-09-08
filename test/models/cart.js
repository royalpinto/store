/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var errors = require('./../../errors');


describe('Cart(Model):', function() {
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
            models.Cart.collection.removeMany(),
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

    it('It should fail the validation.', function(done) {
        var user = new models.User({
            name: "Lohith Royal Pinto",
            email: "royalpinto@gmail.com",
            username: "royalpinto",
            group: "member",
        });
        user.save()
        .then(function() {
            var cart = new models.Cart({
                userId: user._id,
                items: [],
            });
            var cartitem = new models.CartItem({
                productId: null,
                quantity: 90,
            });
            cart.items.push(cartitem);
            return cart.validate();
        })
        .then(function() {
            done("Validation should have failed.");
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

    it('It should fail the validation for invalid items.', function(done) {
        var user = new models.User({
            name: "Lohith Royal Pinto",
            email: "royalpinto@gmail.com",
            username: "royalpinto",
            group: "member",
        });
        user.save()
        .then(function() {
            var cart = new models.Cart({
                userId: user._id,
                items: Object, //Invalid data.
            });
            return cart.validate();
        })
        .then(function() {
            done("Validation should have failed.");
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
});
