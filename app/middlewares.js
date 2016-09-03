var url = require('url');
var querystring = require('querystring');


var easyResponse = function(req, res, next) {
    res.json = function(data) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    };

    res.status = function(status) {
        res.statusCode = status;
        return res;
    };

    next();
};

var querystringParser = function(req, res, next) {
    req.query = querystring.parse(url.parse(req.url).query);
    next();
};


module.exports = {
    querystringParser: querystringParser,
    easyResponse: easyResponse,
};
