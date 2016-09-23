/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var Controller = require('./../../controllers/cartitem');
var controller = new Controller();
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
        description: 'Product description',
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

    it("It should add item to the cart.", function(done) {
        var user = new models.User(userpayload);
        var product;
        user.save()
        .then(function() {
            product = new models.Product(productpayload);
            return product.save();
        })
        .then(function() {
            return controller.create(user._id, product._id, 2);
        })
        .then(function() {
            return models.Cart.findByKey('userId', user._id);
        })
        .then(function(cart) {
            chai.assert.isOk(cart);
            chai.assert.isArray(cart.items);
            chai.assert.lengthOf(cart.items, 1);
            chai.assert.equal(cart.items[0].productId.toString(),
                product._id.toString());

            // Create another product.
            product = new models.Product(productpayload);
            product.code = "ABCDEF";
            return product.save();
        })
        .then(function() {
            return controller.create(user._id, product._id, 2);
        })
        .then(function() {
            return models.Cart.findByKey('userId', user._id);
        })
        .then(function(cart) {
            chai.assert.isOk(cart);
            chai.assert.isArray(cart.items);
            chai.assert.lengthOf(cart.items, 2);
            done();
        })
        .catch(done)
        ;
    });

    it("It should validate adding item to the cart.", function(done) {
        var user = new models.User(userpayload);
        var product;
        user.save()
        .then(function() {
            return controller.create(user._id, new mongodb.ObjectID(), 2);
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error, "productId invalid.");
            product = new models.Product(productpayload);
            return product.save();
        })
        .then(function() {
            return controller.create(user._id, product._id, 100);
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error,
                "quantity is greater than available.");
            return controller.create(user._id, product._id, 10);
        })
        .then(function() {
            return controller.create(user._id, product._id, 10);
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error, "productId already added.");
            done();
        })
        .catch(done)
        ;
    });

    it("It should update item quantity in the cart.", function(done) {
        var user = new models.User(userpayload);
        var product;
        user.save()
        .then(function() {
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
                quantity: 11,
            });
            cart.items.push(cartitem);
            return cart.save();
        })
        .then(function() {
            return controller.update(user._id, product._id, 4);
        })
        .then(function() {
            return models.Cart.findByKey('userId', user._id);
        })
        .then(function(cart) {
            chai.assert.isOk(cart);
            chai.assert.isArray(cart.items);
            chai.assert.lengthOf(cart.items, 1);
            chai.assert.equal(cart.items[0].quantity, 4);
            done();
        })
        .catch(done)
        ;
    });

    it("It should validate updating item in the cart.", function(done) {
        var user = new models.User(userpayload);
        var product;
        user.save()
        .then(function() {
            return controller.update(user._id, new mongodb.ObjectID(), 10);
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error, "productId not added to the cart.");
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
                quantity: 11,
            });
            cart.items.push(cartitem);
            return cart.save();
        })
        .then(function() {
            return controller.update(user._id, new mongodb.ObjectID(), 100);
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error,
                "productId not added to the cart.");
            return controller.update(user._id, product._id, 100);
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error,
                "quantity is greater than available.");
            done();
        })
        .catch(done)
        ;
    });

    it("It should rmeove item from the cart.", function(done) {
        var user = new models.User(userpayload);
        var product;
        user.save()
        .then(function() {
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
                quantity: 11,
            });
            cart.items.push(cartitem);
            return cart.save();
        })
        .then(function() {
            return controller.remove(user._id, product._id);
        })
        .then(function() {
            return models.Cart.findByKey('userId', user._id);
        })
        .then(function(cart) {
            chai.assert.isOk(cart);
            chai.assert.isArray(cart.items);
            chai.assert.lengthOf(cart.items, 0);
            done();
        })
        .catch(done)
        ;
    });

    it("It should validate removing item from the cart.", function(done) {
        var user = new models.User(userpayload);
        var product;
        user.save()
        .then(function() {
            return controller.remove(user._id, new mongodb.ObjectID());
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error, "productId not added to the cart.");
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
                quantity: 11,
            });
            cart.items.push(cartitem);
            return cart.save();
        })
        .then(function() {
            return controller.remove(user._id, new mongodb.ObjectID());
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error,
                "productId not added to the cart.");
            done();
        })
        .catch(done)
        ;
    });

    it("It should checkout items from the cart.", function(done) {
        var user = new models.User(userpayload);
        var product;
        user.save()
        .then(function() {
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
                quantity: 11,
            });
            cart.items.push(cartitem);
            return cart.save();
        })
        .then(function() {
            return controller.checkout(user._id);
        })
        .then(function() {
            return models.Cart.findByKey('userId', user._id);
        })
        .then(function(cart) {
            chai.assert.isOk(cart);
            chai.assert.isArray(cart.items);
            chai.assert.lengthOf(cart.items, 0);
            done();
        })
        .catch(done)
        ;
    });

    it("It should validate checking items from the cart.", function(done) {
        var user = new models.User(userpayload);
        user.save()
        .then(function() {
            return controller.checkout(user._id);
        })
        .catch(function(error) {
            chai.assert.instanceOf(error, errors.ValidationError);
            chai.assert.equal(error.error,
                "Nothing is in the cart to checkout.");
            done();
        })
        .catch(done)
        ;
    });
});
