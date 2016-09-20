/* global describe, it, before */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var server = require('../../app');

chai.should();
chai.use(require('chai-http'));

describe('/', function() {
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

    it("It should handle invalid request.", function(done) {
        chai.request(server)
        .get('/api/nonexistingpath/')
        .then(function() {
            done(true);
        })
        .catch(function(err) {
            err.should.have.status(404);
            done();
        })
        .catch(done);
    });

    it('It should get index page.', function(done) {
        chai.request(server)
        .get('/index.html')
        .then(function(res) {
            res.should.have.status(200);
            done();
        })
        .catch(done);
    });
});
