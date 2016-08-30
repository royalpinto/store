/* global describe, it, beforeEach */

// Strictly use only test env.
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require('config');
var mongoose = require('mongoose');
var server = require('../app');
var Product = require('../models/product');
var User = require('../models/user');

chai.should();

// mpromise (mongoose's default promise library) is deprecated
// Use the default Promise from node.
mongoose.Promise = global.Promise;

server.listen(config.server.port, config.server.listen);
mongoose.connect(config.db.uri);

chai.use(chaiHttp);

describe('Products', function() {
    beforeEach(function(done) {
        Product.remove({})
        .then(function() {
            return User.remove({});
        })
        .then(function() {
            done();
        });
    });

    var productdata = {
        name: "Allen Solly Jeans",
        price: 90,
    };

    // Test to check Product creation is allowed only with login.
    describe('/POST product', function() {
        it('It should fail to POST a product without login.', function(done) {
            chai.request(server)
            .post('/api/products/')
            .send(productdata)
            .end(function(err) {
                err.should.have.status(401);
                done();
            });
        });
    });

    // Test to check Product creation is not allowed for a regular user.
    describe('/POST product', function() {
        it("Regular user is allowed to POST a product.", function(done) {
            var agent = chai.request.agent(server);
            agent
            .post('/api/register/')
            .send({
                username: "royalpinto",
                email: "royalpinto@gmail.com",
                name: "Lohith Royal Pinto",
                password: "password",
            })
            .then(function() {
                return agent.post('/api/products/').send(productdata);
            })
            .catch(function(err) {
                chai.expect(err).to.have.status(403);
                done();
            });
        });
    });

    describe('/GET products', function() {
        it('It should GET the products', function(done) {
            chai.request(server)
            .get('/products/')
            .end(function(err, res) {
                chai.assert.equal(err, null);
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });
    });

    describe('/GET/:id/ product', function() {
        it('It should GET a product by the given id', function(done) {
            var product = new Product(productdata);
            product.save()
            .then(function(product) {
                chai.assert.equal(null);
                chai.request(server)
                .get('/products/' + product._id + '/')
                .end(function(err, res) {
                    chai.assert.equal(err, null);
                    res.should.have.status(200);
                    done();
                });
            });
        });
    });
});
