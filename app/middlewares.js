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


var _parseNumber = function(value, defaultValue, max) {
    if (value instanceof Array) {
        value = value[0];
    }

    value = parseInt(value, 10);
    value = value ? value : defaultValue;
    if (max && value > max) {
        value = max;
    }
    return value;
};

var paginate = function(deafultLimit, maxLimit) {
    return function(req, res, next) {
        req.query.limit = _parseNumber(req.query.limit, deafultLimit, maxLimit);
        req.query.skip = _parseNumber(req.query.skip, 0);
        next();
    };
};


module.exports = {
    querystringParser: querystringParser,
    easyResponse: easyResponse,
    paginate: paginate,
};
