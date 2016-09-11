/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var server = require('../../app');
var initdata = require('../../initdata');


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
            models.Permission.collection.removeMany(),
        ])
        .then(function() {
            return initdata();
        })
        .then(done)
        .catch(done)
        ;
    };

    beforeEach(cleanCollection);
    afterEach(cleanCollection);

    describe('POST /register/', function() {
        it('It should register a user.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('POST /register/', function() {
        it('It should not register because of internal issue.', function(done) {
            // Simple mocking here to generate an error
            // while generating the hash.
            var crypto = require('crypto');
            var pbkdf2 = crypto.pbkdf2;
            crypto.pbkdf2 = function() {
                var cb = arguments[5];
                cb(new Error("Some internal mocked issue."));
            };

            // Reset mock function with actual.
            var cleanup = function(value) {
                crypto.pbkdf2 = pbkdf2;
                done(value);
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
                cleanup(true);
            })
            .catch(function(err) {
                err.should.have.status(500);
                chai.expect(err.response.text)
                    .to.be.equal('Internal server error.');
                cleanup();
            })
            .catch(cleanup)
            ;
        });
    });

    describe('POST /register/', function() {
        it('It should fail to register a user.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
            })
            .then(function() {
                done("Should have failed.");
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal('password invalid.');
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should login a user.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return chai.request(server)
                .post("/login/")
                .send({
                    username: "royalpinto",
                    password: "password",
                })
                ;
            })
            .then(function() {
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should ignore relogin(already logged in).', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent
                .post("/login/")
                .send({
                    username: "royalpinto",
                    password: "password",
                })
                ;
            })
            .then(function() {
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should fail to login with invalid credentials.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return chai.request(server)
                .post("/login/")
                .send({
                    username: "royalpinto",
                    password: "sdcsd",
                })
                ;
            })
            .then(function() {
                done("I shoud have failed.");
            })
            .catch(function(err) {
                err.should.have.status(400);
                chai.expect(err.response.body).to.have.property('error');
                chai.expect(err.response.body.error)
                    .to.be.equal('Invalid credentials.');
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should get logged in user details.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent
                .get("/login/")
                ;
            })
            .then(function(res) {
                res.should.have.status(200);
                chai.expect(res.body).to.have.property('username');
                chai.expect(res.body.username)
                    .to.be.equal('royalpinto');
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should not get user details without login.', function(done) {
            var agent = chai.request.agent(server);
            agent
            .get("/login/")
            .then(function() {
                done("Should have failed.");
            })
            .catch(function(err) {
                err.should.have.status(401);
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should logout.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent
                .get("/logout/")
                ;
            })
            .then(function(res) {
                res.should.have.status(204);
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should handle internal error while logging out', function(done) {
            var backup;
            var session = require('express-session');
            var mock = function() {
                backup = session.Session.prototype.destroy;
                session.Session.prototype.destroy = function(cb) {
                    cb(new Error("Mocked error :)"));
                };
            };
            var demock = function() {
                session.Session.prototype.destroy = backup;
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
                return agent.get("/logout/");
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
});
