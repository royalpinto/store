/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var controller = require('./../../controllers/product');


describe('Product(Controller):', function() {
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

    it("It should create a product", function(done) {
        controller.create(payload)
        .then(function(product) {
            chai.assert.isOk(product._id);
            return models.Product.findById(product._id);
        })
        .then(function(product) {
            chai.assert.isOk(product);
            done();
        })
        .catch(done)
        ;
    });

    it("It should get a product", function(done) {
        controller.create(payload)
        .then(function(product) {
            return controller.getById(product._id.toString());
        })
        .then(function(product) {
            chai.assert.isOk(product);
            chai.assert.isOk(product._id);
            done();
        })
        .catch(done)
        ;
    });

    it("It should get products", function(done) {
        var products = [];
        var i;
        for (i = 0; i < 10; i++) {
            var product = new models.Product(payload);
            // This is required as username is unique.
            product.code += i;
            products.push(product.save());
        }
        Promise.all(products)
        .then(function() {
            return controller.get({}, 2, 4, {});
        })
        .then(function(products) {
            chai.assert.strictEqual(products.count, 10);
            chai.assert.isArray(products.data);
            chai.assert.strictEqual(products.data.length, 2);
            done();
        })
        .catch(done)
        ;
    });

    it("It should update a product", function(done) {
        var product;
        controller.create(payload)
        .then(function(_product) {
            product = _product;
            return controller.update(product._id, {code: "ABCDEF"});
        })
        .then(function() {
            return models.Product.findById(product._id);
        })
        .then(function(product) {
            chai.assert.equal(product.code, "ABCDEF");
            done();
        })
        .catch(done)
        ;
    });

    it("It should remove a product", function(done) {
        var product;
        controller.create(payload)
        .then(function(_product) {
            product = _product;
            return controller.remove(product._id);
        })
        .then(function() {
            return models.Product.findById(product._id);
        })
        .then(function(product) {
            chai.assert.isNotOk(product);
            done();
        })
        .catch(done)
        ;
    });
});
