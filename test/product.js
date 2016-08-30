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

    describe('/POST product', function() {
        it('It should POST a product', function(done) {
            chai.request(server)
            .post('/products/')
            .send(productdata)
            .end(function(err, res) {
                chai.assert.equal(err, null);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('price');
                // Check if it is really created in the database.
                Product.findById(res.body._id, function(err, insertedProduct) {
                    chai.assert.equal(err, null);
                    chai.assert.equal(productdata.name, insertedProduct.name);
                    chai.assert.equal(productdata.price, insertedProduct.price);
                    done();
                });
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
