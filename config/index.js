'use strict';


const env = process.env.NODE_ENV || 'development';

const config = require("./" + env);
config.env = env;

module.exports = config;
