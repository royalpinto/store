/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var server;


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
                server = require('../../app');
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
            models.db.collection(models.User.collectionName).removeMany(),
            models.db.collection(models.Product.collectionName).removeMany(),
            models.db.collection(models.Permission.collectionName).removeMany(),
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

    describe('POST /cart/items/', function() {
        it('It should POST a cart item.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                var product = new models.Product({
                    name: 'Allen Solly Jeans',
                    code: 'ALNS02',
                    price: 12,
                    quantity: 10,
                    category: 'Clothing',
                    brand: 'Allen Solly',
                });
                return product.save()
                .then(function() {
                    return product;
                });
            })
            .then(function(product) {
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
                console.log(err.body);
                done(err);
            })
            ;
        });
    });
});
