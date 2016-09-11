/* global describe, it, beforeEach, afterEach */

var chai = require('chai');
var configpath = './../../config';
var config = require(configpath);
var env = config.env;

describe("Config(Others)", function() {
    beforeEach(function() {
        delete require.cache[require.resolve(configpath)];
    });

    afterEach(function() {
        delete require.cache[require.resolve(configpath)];
        process.env.NODE_ENV = env;
    });

    it("It should load default development config file.", function(done) {
        process.env.NODE_ENV = '';
        var config = require(configpath);
        chai.assert.equal(config.env, 'development');
        done();
    });

    it("It should load appropriate config file.", function(done) {
        process.env.NODE_ENV = 'test';
        var config = require(configpath);
        chai.assert.equal(config.env, 'test');
        done();
    });
});
