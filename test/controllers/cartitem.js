/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var controller = require('./../../controllers/cartitem');


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
            models.Permission.collection.removeMany(),
            models.Product.collection.removeMany(),
            models.Cart.collection.removeMany(),
        ])
        .then(function() {
            done();
        })
        ;
    };

    beforeEach(cleanCollection);
    afterEach(cleanCollection);

    var userpayload = {
        name: "Lohith Royal Pinto",
        email: "royalpinto@gmail.com",
        username: "royalpinto",
        password: "password",
        group: "member",
    };

    var productpayload = {
        name: "Allen Solly Jeans",
        code: "ALNS001",
        price: 90,
        quantity: 12,
        category: "Clothing",
        brand: "Allen Solley",
    };

    it("It should get cart items", function(done) {
        var user = new models.User(userpayload);
        var product;
        user.save()
        .then(function() {
            return controller.get(user._id);
        })
        .then(function(cartitems) {
            chai.assert.isOk(cartitems);
            chai.assert.isArray(cartitems);
            chai.assert.lengthOf(cartitems, 0);
            product = new models.Product(productpayload);
            return product.save();
        })
        .then(function() {
            var cart = new models.Cart({
                userId: user._id,
                items: [],
            });
            var cartitem = new models.CartItem({
                productId: product._id,
                quantity: 90,
            });
            cart.items.push(cartitem);
            return cart.save();
        })
        .then(function() {
            return controller.get(user._id);
        })
        .then(function(cartitems) {
            chai.assert.isOk(cartitems);
            chai.assert.isArray(cartitems);
            chai.assert.lengthOf(cartitems, 1);
            chai.assert.isOk(cartitems[0].product);
            done();
        })
        .catch()
        ;
    });
});
