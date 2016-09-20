/* global describe, it, before, beforeEach, afterEach */

var util = require('util');
var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var server = require('../../app');
var controller = require('./../../controllers/product');


chai.should();
chai.use(require('chai-http'));


describe('Products:', function() {
    before(function(done) {
        mongodb.MongoClient.connect(config.db.uri)
        .then(function(db) {
            return models.init(db);
        })
        .then(function() {
            var port = config.server.port;
            var listen = config.server.listen;
            server.listen(port, listen, function(err) {
                done(err || undefined);
            });
        })
        .catch(done)
        ;
    });

    var cleanCollection = function(done) {
        Promise.all([
            models.Product.collection.removeMany(),
            models.User.collection.removeMany(),
            models.Permission.collection.removeMany(),
        ])
        .then(function() {
            return models.Permission.add('admin', 'projects', 'write');
        })
        .then(function() {
            done();
        })
        ;
    };

    beforeEach(cleanCollection);
    afterEach(cleanCollection);

    // Test to check Product creation is allowed only with login.
    describe('/POST product', function() {
        it('It should fail to POST a product without login.', function(done) {
            chai.request(server)
            .post('/api/products/')
            .send({})
            .end(function(err) {
                err.should.have.status(401);
                done();
            });
        });
    });

    var payload = {
        name: "Allen Solly Jeans",
        code: "ALNS001",
        price: 90,
        quantity: 12,
        category: "Clothing",
        brand: "Allen Solley",
    };

    describe('/POST product', function() {
        it('It should get products.', function(done) {
            controller.create(payload)
            .then(function() {
                return chai.request(server).get('/api/products/');
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.property('count');
                chai.expect(res.body.count).to.be.equal(1);
                done();
            })
            .catch(done);
        });
    });

    describe('/GET product', function() {
        it('It should not get products for an internal error.', function(done) {
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

            controller.create(payload)
            .then(function() {
                mock();
                return chai.request(server).get('/api/products/');
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

    describe('/GET product', function() {
        it('It should not allow to limit > max allowed.', function(done) {
            var promises = [];
            for (var i = 0; i < 100; i++) {
                var localpayload = JSON.parse(JSON.stringify(payload));
                localpayload.code += i;
                promises.push(controller.create(localpayload));
            }
            Promise.all(promises)
            .then(function() {
                return chai.request(server).get('/api/products/')
                .query({
                    limit: [100, 90], // It should ignore both and apply 50(max).
                })
                ;
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.property('count');
                chai.expect(res.body.count).to.be.equal(100);
                chai.expect(res.body.data.length).to.be.equal(50);
                done();
            })
            .catch(done);
        });
    });

    describe('/GET product', function() {
        it('It should search products.', function(done) {
            var promises = [];
            for (var i = 0; i < 100; i++) {
                var localpayload = JSON.parse(JSON.stringify(payload));
                localpayload.code += i;
                promises.push(controller.create(localpayload));
            }
            Promise.all(promises)
            .then(function() {
                return chai.request(server).get('/api/products/')
                .query({
                    limit: 5, // It should ignore both and apply 50(max).
                    search: "Allen",
                    order: ["name", "~code"],
                })
                ;
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.property('count');
                chai.expect(res.body.count).to.be.equal(100);
                chai.expect(res.body.data.length).to.be.equal(5);
                return chai.request(server).get('/api/products/')
                .query({
                    limit: 5, // It should ignore both and apply 50(max).
                    search: ["Allen", "Lee"], // Mutliple keywords.
                    order: ["name", "~code"],
                })
                ;
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.property('count');
                chai.expect(res.body.count).to.be.equal(100);
                chai.expect(res.body.data.length).to.be.equal(5);
                done();
            })
            .catch(done);
        });
    });

    describe('/POST product', function() {
        it('It should not post a product with invalid data.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function(res) {
                return models.User.findById(res.body._id);
            })
            .then(function(user) {
                user.group = "admin";
                return user.save();
            })
            .then(function() {
                var localpayload = JSON.parse(JSON.stringify(payload));
                delete localpayload.code;
                return agent
                .post('/api/products/')
                .send(localpayload)
                ;
            })
            .then(function() {
                done(true);
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal("code is required.");
                done();
            })
            .catch(done);
        });
    });

    describe('/POST product', function() {
        it('It should post a product with valid data.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function(res) {
                return models.User.findById(res.body._id);
            })
            .then(function(user) {
                user.group = "admin";
                return user.save();
            })
            .then(function() {
                return agent
                .post('/api/products/')
                .send(payload)
                ;
            })
            .then(function(res) {
                res.should.have.status(201);
                chai.expect(res).to.have.header('location',
                    util.format('/api/products/%s/', res.body._id));
                chai.expect(res.body).to.have.property('_id');
                done();
            })
            .catch(done);
        });
    });

    describe('/GET product', function() {
        it('It should get a product.', function(done) {
            var product;
            controller.create(payload)
            .then(function(_product) {
                product = _product;
                return chai.request(server)
                .get('/api/products/' + product._id.toString() + '/')
                ;
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.property('_id');
                chai.expect(res.body._id).to.be.equal(product._id.toString());
                done();
            })
            .catch(done);
        });
    });

    describe('/GET product', function() {
        it('It should not get a product for invalid id.', function(done) {
            chai.request(server)
            .get('/api/products/' + (new mongodb.ObjectID()).toString() + '/')
            .then(function() {
                done(true);
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal("resource not found.");
                done();
            })
            .catch(done);
        });
    });

    describe('/PUT product', function() {
        it('It should not update a product for invalid id.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function(res) {
                return models.User.findById(res.body._id);
            })
            .then(function(user) {
                user.group = "admin";
                return user.save();
            })
            .then(function() {
                return agent
                .put(
                    '/api/products/' + (new mongodb.ObjectID()).toString() + '/'
                )
                .send({
                    name: "ABCDEDFGH",
                })
                ;
            })
            .then(function() {
                done(true);
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal("resource not found.");
                done();
            })
            .catch(done);
        });
    });

    describe('/PUT product', function() {
        it('It should update a product with valid data.', function(done) {
            var agent = chai.request.agent(server);
            var product;
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function(res) {
                return models.User.findById(res.body._id);
            })
            .then(function(user) {
                user.group = "admin";
                return user.save();
            })
            .then(function() {
                return controller.create(payload);
            })
            .then(function(_product) {
                product = _product;
                return agent
                .put('/api/products/' + product._id.toString() + '/')
                .send({
                    code: "SOMETHINGELSE",
                })
                ;
            })
            .then(function(res) {
                res.should.have.status(204);
                return models.Product.findById(product._id);
            })
            .then(function(_product) {
                chai.assert.equal(_product.code, "SOMETHINGELSE");
                done();
            })
            .catch(done);
        });
    });

    describe('/DELETE product', function() {
        it('It should not delete a product for invalid id.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function(res) {
                return models.User.findById(res.body._id);
            })
            .then(function(user) {
                user.group = "admin";
                return user.save();
            })
            .then(function() {
                return agent
                .delete('/api/products/' +
                    (new mongodb.ObjectID()).toString() + '/')
                ;
            })
            .then(function() {
                done(true);
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal("resource not found.");
                done();
            })
            .catch(done);
        });
    });

    describe('/DELETE product', function() {
        it('It should delete a product.', function(done) {
            var agent = chai.request.agent(server);
            var product;
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function(res) {
                return models.User.findById(res.body._id);
            })
            .then(function(user) {
                user.group = "admin";
                return user.save();
            })
            .then(function() {
                return controller.create(payload);
            })
            .then(function(_product) {
                product = _product;
                return agent
                .delete('/api/products/' + product._id.toString() + '/')
                ;
            })
            .then(function(res) {
                res.should.have.status(204);
                return models.Product.findById(product._id);
            })
            .then(function(_product) {
                chai.assert.isNotOk(_product);
                done();
            })
            .catch(done);
        });
    });

    describe('/api/products/categories/', function() {
        it('It should get categories.', function(done) {
            controller.create(payload)
            .then(function() {
                return chai.request(server).get('/api/products/categories/');
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.property('count');
                chai.expect(res.body.count).to.be.equal(1);
                done();
            })
            .catch(done);
        });
    });

    describe('/api/products/categories/', function() {
        it('It should get categories.', function(done) {
            controller.create(payload)
            .then(function() {
                return chai.request(server).get('/api/products/categories/')
                .query({
                    search: payload.category,
                });
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.property('count');
                chai.expect(res.body.count).to.be.equal(1);
                done();
            })
            .catch(done);
        });
    });

    describe('/api/products/brands/', function() {
        it('It should get brands.', function(done) {
            controller.create(payload)
            .then(function() {
                return chai.request(server).get('/api/products/brands/');
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.property('count');
                chai.expect(res.body.count).to.be.equal(1);
                done();
            })
            .catch(done);
        });
    });
});
