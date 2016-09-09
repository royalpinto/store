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
});
