var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = require('./router');
var models = require('./../models');
var middlewares = require('./middlewares');

var approuter = new router.Router();

var auth = require('./../routes/auth');
var users = require('./../routes/user');
var products = require('./../routes/product');

approuter.use(middlewares.easyResponse);
approuter.use(middlewares.querystringParser);
approuter.use(bodyParser.json());
approuter.use(bodyParser.urlencoded({extended: false}));
approuter.use(cookieParser());
approuter.use(session({
    secret: 'sdasdsda',
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
        db: models.db,
    }),
}));

approuter.use(auth);
approuter.use(users);
approuter.use(products);

var server = http.createServer(function(req, res) {
    approuter.dispatch(req, res, function() {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    });
});


module.exports = server;
