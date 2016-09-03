var http = require('http');
var url = require('url');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = require('./router');
var models = require('./../models');

var approuter = new router.Router();

var auth = require('./../routes/auth');
var users = require('./../routes/user');

approuter.use(function(req, res, next) {
    req.query = querystring.parse(url.parse(req.url).query);
    next();
});
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

approuter.use(/^\/users\//, users);
approuter.use(auth);
approuter.use(/^\/users\//, users);

var server = http.createServer(function(req, res) {
    approuter.dispatch(req, res, function() {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    });
});


module.exports = server;
