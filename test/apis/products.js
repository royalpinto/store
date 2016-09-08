/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var server = require('../../app');


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
});
