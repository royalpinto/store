/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var errors = require('./../../errors');


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
        Promise.all([
            models.Permission.collection.removeMany(),
            models.User.collection.removeMany(),
            models.Product.collection.removeMany(),
        ])
        .then(function() {
            done();
        })
        ;
    };

    beforeEach(cleanCollection);
    afterEach(cleanCollection);

    var payload = {
        name: "Allen Solly Jeans",
        code: "ALNS001",
        price: 90,
        quantity: 12,
        category: "Clothing",
        brand: "Allen Solley",
    };

    it("It should validate a product.", function(done) {
        var product = new models.Product(payload);
        product.price = -1;
        product.validate()
        .then(function() {
            done('Validation should have failed.');
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            product.price = 1000001; // Too high.
            return product.validate();
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            product.price = 'adcsd';
            return product.validate();
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            product.code = "a"; // Too Small
            return product.validate();
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            product.price = payload.price;
            product.code = Array(257).join("a"); // Too Large
            return product.validate();
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            product.price = payload.price;
            product.code = null; // Required
            return product.validate();
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            done();
        })
        .catch(done)
        ;
    });

    it("It should create a product.", function(done) {
        var product = new models.Product(payload);
        product.save()
        .then(function() {
            return models.Product.collection
            .findOne({
                _id: product._id,
            })
            ;
        })
        .then(function(productjson) {
            chai.assert.isOk(productjson._id.equals(product._id));
            chai.assert.strictEqual(productjson.name, product.name);
            chai.assert.strictEqual(productjson.code, product.code);
            chai.assert.strictEqual(productjson.price, product.price);
            done();
        })
        .catch(done)
        ;
    });

    it("It should not create another product with same code.", function(done) {
        var product = new models.Product(payload);
        product.save()
        .then(function() {
            var product = new models.Product(payload);
            return product.save();
        })
        .then(function() {
            done("Validation should have failed.");
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            done();
        })
        ;
    });

    it("It should update a product.", function(done) {
        var product = new models.Product(payload);
        product.save()
        .then(function() {
            product.name = "Something else.";
            return product.save();
        })
        .then(function() {
            return models.Product.collection
            .findOne({
                _id: product._id,
            })
            ;
        })
        .then(function(productjson) {
            chai.assert.strictEqual(productjson.name, "Something else.");
            done();
        })
        .catch(done)
        ;
    });
});
