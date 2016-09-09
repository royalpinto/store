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
            chai.assert.instanceOf(error, errors.ValidationError);
            var cart = new models.Cart({
                userId: user._id,
                items: [],
            });
            var cartitem = new models.CartItem({
                productId: "I am something but not valid",
                quantity: 90,
            });
            cart.items.push(cartitem);
            return cart.validate();
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
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

    it('It should add a cart item.', function(done) {
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
                productId: new mongodb.ObjectID(),
                quantity: 90,
            });
            cart.items.push(cartitem);
            // Even regular object should be allowed to push.
            cart.items.push({
                productId: new mongodb.ObjectID(),
                quantity: 90,
            });
            return cart.validate();
        })
        .then(function() {
            done();
        })
        .catch(errors)
        ;
    });

    it('It should get Projects from cart.', function(done) {
        var projectPayload = {
            name: "Allen Solly Jeans",
            code: "ALNS001",
            price: 90,
            quantity: 12,
            category: "Clothing",
            brand: "Allen Solley",
        };
        var user = new models.User({
            name: "Lohith Royal Pinto",
            email: "royalpinto@gmail.com",
            username: "royalpinto",
            group: "member",
        });
        var product;
        var cart;
        user.save()
        .then(function() {
            product = new models.Product(projectPayload);
            return product.save();
        })
        .then(function() {
            cart = new models.Cart({
                userId: user._id,
                items: [],
            });
            cart.items.push(new models.CartItem({
                productId: product._id,
                quantity: 90,
            }));
            return cart.save();
        })
        .then(function() {
            return cart.getProducts();
        })
        .then(function(products) {
            chai.assert.isArray(products);
            chai.assert.equal(products.length, 1);
            chai.assert.instanceOf(products[0], models.Product);
            done();
        })
        .catch(done)
        ;
    });
});
