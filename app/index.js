'use strict';


/**
 * @module app
 * @namespace app
 */

const http = require('http');
const staticServer = require('node-static');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = require('./router');
const models = require('./../models');
const logging = require('./../logging');

const approuter = new router.Router();

const apirouter = require('./../routes');

approuter.use(logging.middleware);

approuter.use(bodyParser.json());
approuter.use(bodyParser.urlencoded({extended: false}));
approuter.use(session({
    secret: 'sdasdsda',
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
        dbPromise: models.getDB(),
    }),
}));

approuter.use(/^\/api\//, apirouter);


const publicServer = new staticServer.Server('./public');
const bowerServer = new staticServer.Server('./bower_components');

approuter.use((req, res, next) => {
    publicServer.serve(req, res)
    .on('error', err => {
        if (err.status === 404) {
            next();
        }
    })
    ;
});

approuter.use((req, res, next) => {
    bowerServer.serve(req, res)
    .on('error', err => {
        if (err.status === 404) {
            next();
        }
    })
    ;
});


// Finally if non of the routes have matched or responded.
// Send index file to support HTML5 mode.
approuter.use((req, res) => {
    publicServer.serveFile('index.html', 200, {}, req, res);
});

const server = http.createServer((req, res) => {
    approuter.dispatch(req, res);
});


module.exports = server;
