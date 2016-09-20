var http = require('http');
var staticServer = require('node-static');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = require('./router');
var models = require('./../models');
var middlewares = require('./middlewares');
var logging = require('./../logging');

var approuter = new router.Router();

var apirouter = require('./../routes');

approuter.use(logging.middleware);

approuter.use(middlewares.easyResponse);
approuter.use(middlewares.querystringParser);
approuter.use(middlewares.paginate(10, 50));
approuter.use(middlewares.orderParser);
approuter.use(middlewares.searchParser);
approuter.use(bodyParser.json());
approuter.use(bodyParser.urlencoded({extended: false}));
approuter.use(cookieParser());
approuter.use(session({
    secret: 'sdasdsda',
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
        dbPromise: models.getDB(),
    }),
}));

approuter.use(/^\/api\//, apirouter);


var publicServer = new staticServer.Server('./public');
var bowerServer = new staticServer.Server('./bower_components');

approuter.use(function(req, res, next) {
    publicServer.serve(req, res)
    .on('error', function(err) {
        if (err.status === 404) {
            next();
        }
    })
    ;
});

approuter.use(function(req, res, next) {
    bowerServer.serve(req, res)
    .on('error', function(err) {
        if (err.status === 404) {
            next();
        }
    })
    ;
});


// Finally if non of the routes have matched or responded.
approuter.use(function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
});

var server = http.createServer(function(req, res) {
    approuter.dispatch(req, res);
});


module.exports = server;
