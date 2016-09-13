var env = process.env.NODE_ENV || 'development';

var config = require("./" + env);
config.env = env;

module.exports = config;
