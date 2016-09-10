/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var server = require('../../app');
var controller = require('../../controllers/cartitem.js');


chai.should();
chai.use(require('chai-http'));


describe('/cart/items/', function() {
    before(function(done) {
        mongodb.MongoClient.connect(config.db.uri)
        .then(function(db) {
            return models.init(db);
        })
        .then(function() {
            return new Promise(function(resolve, reject) {
                var port = config.server.port;
                var listen = config.server.listen;
                server.listen(port, listen, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        })
        .then(done)
        .catch(done)
        ;
    });

    var cleanCollection = function(done) {
        Promise.all([
            models.User.collection.removeMany(),
            models.Cart.collection.removeMany(),
            models.Product.collection.removeMany(),
            models.Permission.collection.removeMany(),
        ])
        .then(function() {
            return models.Permission.add('admin', 'users', 'readwrite');
        })
        .then(done)
        .catch(done)
        ;
    };

    beforeEach(cleanCollection);
    afterEach(cleanCollection);

    describe('GET /cart/items/', function() {
        it('It should fail to GET cart items without login.', function(done) {
            var agent = chai.request.agent(server);
            agent.get('/cart/items/')
            .end(function(err) {
                err.should.have.status(401);
                done();
            });
        });
    });

    describe('GET /cart/items/', function() {
        it('It should GET cart items.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent.get('/cart/items/');
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.length(0);
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /cart/items/', function() {
        it("It shouldn't GET cart items for an internal error", function(done) {
            var backup;
            var mock = function() {
                backup = controller.get;
                controller.get = function() {
                    return Promise.reject(new Error("Mocked error :)"));
                };
            };
            var demock = function() {
                controller.get = backup;
            };

            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                mock();
                return agent.get('/cart/items/');
            })
            .then(function() {
                demock();
                done(true);
            })
            .catch(function(err) {
                err.should.have.status(500);
                chai.expect(err.response.text)
                    .to.be.equal('Internal server error.');
                demock();
                done();
            })
            .catch(function() {
                demock();
                done(true);
            })
            ;
        });
    });

    describe('POST /cart/items/', function() {
        it('It should fail to POST a cart item.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent.post('/cart/items/').send({
                    projectId: new mongodb.ObjectID(),
                    quantity: 2,
                });
            })
            .then(function() {
                done("I should not have come here.");
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal('productId invalid.');
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('POST /cart/items/', function() {
        it('It should POST a cart item.', function(done) {
            var product;
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                product = new models.Product({
                    name: 'Allen Solly Jeans',
                    code: 'ALNS02',
                    price: 12,
                    quantity: 10,
                    category: 'Clothing',
                    brand: 'Allen Solly',
                });
                return product.save();
            })
            .then(function() {
                return agent.post('/cart/items/').send({
                    projectId: product._id,
                    quantity: 2,
                });
            })
            .then(function() {
                return agent.get('/cart/items/');
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.length(1);
                chai.expect(res.body).to.have.deep
                    .property('[0].product.name', product.name);
                done();
            })
            .catch(function(err) {
                done(err);
            })
            ;
        });
    });

    describe('PUT /cart/items/', function() {
        it('It should update a cart item quantity.', function(done) {
            var agent = chai.request.agent(server);
            var product = null;
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                product = new models.Product({
                    name: 'Allen Solly Jeans',
                    code: 'ALNS02',
                    price: 12,
                    quantity: 10,
                    category: 'Clothing',
                    brand: 'Allen Solly',
                });
                return product.save();
            })
            .then(function() {
                return agent.post('/cart/items/').send({
                    projectId: product._id,
                    quantity: 2,
                });
            })
            .then(function() {
                return agent.put('/cart/items/').send({
                    projectId: product._id,
                    quantity: 3,
                });
            })
            .then(function() {
                return agent.get('/cart/items/');
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.length(1);
                done();
            })
            .catch(function(err) {
                done(err);
            })
            ;
        });
    });

    describe('PUT /cart/items/', function() {
        it('It should fail to update a cart item quantity.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent.put('/cart/items/').send({
                    projectId: new mongodb.ObjectID(),
                    quantity: 2,
                });
            })
            .then(function() {
                done("I should not have come here.");
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal('productId not added to the cart.');
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('DELETE /cart/items/', function() {
        it('It should delete a cart item.', function(done) {
            var agent = chai.request.agent(server);
            var product = null;
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                product = new models.Product({
                    name: 'Allen Solly Jeans',
                    code: 'ALNS02',
                    price: 12,
                    quantity: 10,
                    category: 'Clothing',
                    brand: 'Allen Solly',
                });
                return product.save();
            })
            .then(function() {
                return agent.post('/cart/items/').send({
                    projectId: product._id,
                    quantity: 2,
                });
            })
            .then(function() {
                return agent.delete('/cart/items/').query({
                    projectId: product._id.toString(),
                });
            })
            .then(function() {
                return agent.get('/cart/items/');
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.length(0);
                done();
            })
            .catch(function(err) {
                done(err);
            })
            ;
        });
    });

    describe('DELETE /cart/items/', function() {
        it('It should fail to delete a cart item.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent.delete('/cart/items/').query({
                    projectId: new mongodb.ObjectID(),
                });
            })
            .then(function() {
                done("I should not have come here.");
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal('productId not added to the cart.');
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('POST /cart/checkout/', function() {
        it('It should checkout the cart.', function(done) {
            var agent = chai.request.agent(server);
            var product = null;
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                product = new models.Product({
                    name: 'Allen Solly Jeans',
                    code: 'ALNS02',
                    price: 12,
                    quantity: 10,
                    category: 'Clothing',
                    brand: 'Allen Solly',
                });
                return product.save();
            })
            .then(function() {
                return agent.post('/cart/items/').send({
                    projectId: product._id,
                    quantity: 2,
                });
            })
            .then(function() {
                return agent.post('/cart/checkout/');
            })
            .then(function(res) {
                res.should.have.status(204);
                return agent.get('/cart/items/');
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.length(0);
                done();
            })
            .catch(function(err) {
                done(err);
            })
            ;
        });
    });

    describe('POST /cart/checkout/', function() {
        it('It should fail to checkout the cart.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent.post('/cart/checkout/');
            })
            .then(function() {
                done("I should not have come here.");
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal("Nothing is in the cart to checkout.");
                done();
            })
            .catch(done)
            ;
        });
    });
});
