var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = require('./router');
var models = require('./../models');
var middlewares = require('./middlewares');
var logging = require('./../logging');

var approuter = new router.Router();

var auth = require('./../routes/auth');
var users = require('./../routes/user');
var products = require('./../routes/product');
var cartitem = require('./../routes/cartitem');

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

approuter.use(auth);
approuter.use(users);
approuter.use(products);
approuter.use(cartitem);

approuter.use(/\//, middlewares.static(path.join(__dirname, '..'), 'public/'));
approuter.use(/\//,
    middlewares.static(path.join(__dirname, '..'), 'bower_components/'));

// Finally if non of the routes have matched or responded.
approuter.use(function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
});

var server = http.createServer(function(req, res) {
    approuter.dispatch(req, res);
});


module.exports = server;
