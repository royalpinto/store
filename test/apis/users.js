/* global describe, it, before, beforeEach, afterEach */

var chai = require('chai');
var mongodb = require('mongodb');
var config = require('./../../config');
var models = require('./../../models');
var server = require('../../app');
var controller = require('../../controllers/user.js');
var initdata = require('../../initdata');


chai.should();
chai.use(require('chai-http'));


describe('/api/users/', function() {
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

    describe('GET /users/', function() {
        it('It should fail to GET users without login.', function(done) {
            var agent = chai.request.agent(server);
            agent.get('/api/users/')
            .end(function(err) {
                err.should.have.status(401);
                done();
            });
        });
    });

    describe('GET /users/', function() {
        it('It should fail to GET users with regular user.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                return agent.get('/api/users/');
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
        it('It should not GET users if unable to authorize.', function(done) {
            var backup;
            var controller = require('../../controllers/auth.js');
            var mock = function() {
                backup = controller.hasPermission;
                controller.hasPermission = function() {
                    return Promise.reject(new Error("Mocked error :)"));
                };
            };
            var demock = function() {
                controller.hasPermission = backup;
            };

            var agent = chai.request.agent(server);
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function() {
                mock();
                return agent.get('/api/users/');
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

    describe('GET /users/', function() {
        it('It should not GET users if unable to fetch.', function(done) {
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
                mock();
                return agent.get('/api/users/');
            })
            .then(function(res) {
                console.log(res.body);
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
                console.log(arguments);
                demock();
                done(true);
            })
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should GET users with authorized user.', function(done) {
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
                return agent.get('/api/users/');
            })
            .then(function(res) {
                chai.expect(res).to.have.status(200);
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/', function() {
        it('It should GET(search) users with authorized user.', function(done) {
            var agent = chai.request.agent(server);
            agent.post('/api/register/')
            .send({
                name: 'Lohith Royal Pinto',
                email: 'royalpinto@gmail.com',
                username: 'royalpinto',
                password: 'password',
            })
            .then(function(res) {
                return models.User.findById(res.body._id);
            })
            .then(function(user) {
                user.group = 'admin';
                return user.save();
            })
            .then(function() {
                return agent.get('/api/users/')
                .query({
                    search: 'pinto',
                })
                ;
            })
            .then(function(res) {
                chai.expect(res).to.have.status(200);
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/id/', function() {
        it('It should GET users with authorized user.', function(done) {
            var agent = chai.request.agent(server);
            var userid = null;
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function(res) {
                userid = res.body._id;
                return models.User.findById(res.body._id);
            })
            .then(function(user) {
                user.group = "admin";
                return user.save();
            })
            .then(function() {
                return agent.get('/api/users/' + userid + '/');
            })
            .then(function(res) {
                chai.expect(res).to.have.status(200);
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('GET /users/id/', function() {
        it('It should not GET user with invalid id.', function(done) {
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
                return agent.get('/api/users/' +
                    (new mongodb.ObjectID()).toString() + '/');
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
            .catch(done)
            ;
        });
    });

    describe('DELETE /users/id/', function() {
        it('It should DELETE user with authorized user login.', function(done) {
            var agent = chai.request.agent(server);
            var userid = null;
            agent.post('/api/register/')
            .send({
                name: "Lohith Royal Pinto",
                email: "royalpinto@gmail.com",
                username: "royalpinto",
                password: "password",
            })
            .then(function(res) {
                userid = res.body._id;
                return models.User.findById(res.body._id);
            })
            .then(function(user) {
                user.group = "admin";
                return user.save();
            })
            .then(function() {
                return agent.delete('/api/users/' + userid + '/');
            })
            .then(function(res) {
                chai.expect(res).to.have.status(204);
                done();
            })
            .catch(done)
            ;
        });
    });

    describe('DELETE /users/id/', function() {
        it('It should fail to DELETE with invalid id.', function(done) {
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
                return agent.delete('/api/users/' +
                    (new mongodb.ObjectID()).toString() + '/');
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
            .catch(done)
            ;
        });
    });
});
