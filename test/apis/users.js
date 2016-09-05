/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var server;


chai.should();
chai.use(require('chai-http'));


describe('/users/', function() {
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

    describe('GET /users/', function() {
        it('It should fail to GET users without login.', function(done) {
            var agent = chai.request.agent(server);
            agent.get('/users/')
            .end(function(err) {
                err.should.have.status(401);
                done();
            });
        });
    });

    describe('GET /users/', function() {
        it('It should fail to GET users with regular user.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent.get('/users/');
            })
            .then(function() {
                done("Should have failed.");
            })
            .catch(function(err) {
                err.should.have.status(403);
                done();
            })
            .catch(function(err) {
                done(err);
            })
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should GET users with authorized user.', function(done) {
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
                return agent.get('/users/');
            })
            .then(function(res) {
                chai.expect(res).to.have.status(200);
                done();
            })
            .catch(done)
            ;
        });
    });

});
