var env = process.env.NODE_ENV;
if (!env || env === 'development') {
    env = 'default';
}

module.exports = require("./" + env);
