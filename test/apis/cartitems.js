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
});
