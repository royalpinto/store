/* global describe, it, before, beforeEach, afterEach */

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
            .post('/products/')
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
                return chai.request(server).get('/products/');
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

    describe('/POST product', function() {
        it('It should not post a product with invalid data.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
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
                .post('/products/')
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

    describe('/GET product', function() {
        it('It should get a product.', function(done) {
            var product;
            controller.create(payload)
            .then(function(_product) {
                product = _product;
                return chai.request(server)
                .get('/products/' + product._id.toString() + '/')
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
            .get('/products/' + (new mongodb.ObjectID()).toString() + '/')
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
            agent.post('/register/')
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
                .put('/products/' + (new mongodb.ObjectID()).toString() + '/')
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

    describe('/DELETE product', function() {
        it('It should not delete a product for invalid id.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
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
                .delete('/products/' +
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
});
