var url = require('url');
var querystring = require('querystring');
var authController = require('../controllers/auth');
var errors = require('./../errors');


var auth = function(noun, verb) {
    return function(req, res, next) {
        if (!req.session.user) {
            var error = new errors.UnauthenticatedAccess();
            return errors.handle(req, res, error);
        }

        if (!(noun && verb)) {
            return next();
        }

        authController
        .hasPermission(req.session.user._id, noun, verb)
        .then(function(permit) {
            if (permit) {
                next();
            } else {
                var error = new errors.UnauthorizedAccess();
                errors.handle(req, res, error);
            }
        })
        .catch(function(error) {
            errors.handle(req, res, error);
        })
        ;
    };
};


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


var orderParser = function(req, res, next) {
    var order = {};
    var _order = req.query.order;

    if (!(_order instanceof Array)) {
        _order = [_order];
    }

    for (var i = 0; i < _order.length; i++) {
        var orderItem = _order[i];
        var field;
        var direction;
        if (orderItem && orderItem.indexOf('~') === 0) {
            field = orderItem.slice(1);
            direction = -1;
        } else {
            field = orderItem;
            direction = 1;
        }
        if (field) {
            order[field] = direction;
        }
    }

    req.query.order = order;
    next();
};


var searchParser = function(req, res, next) {
    var _search = req.query.search;
    if (!(_search instanceof Array)) {
        _search = [_search];
    }
    var search = [];
    _search.forEach(function(i) {
        if (i) {
            search.push(new RegExp(i, 'i'));
        }
    });
    if (search.length > 0) {
        req.query.search = {
            $in: search,
        };
    } else {
        delete req.query.search;
    }
    next();
};


var filter = function(req, res, next) {
    var filter = {};
    for (var key in req.query) {
        if (!key) {
            continue;
        }
        if (['search', 'limit', 'skip', 'order'].indexOf(key) > -1) {
            continue;
        }
        var value = req.query[key];
        if (value instanceof Array) {
            filter[key] = {
                $in: value,
            };
        } else {
            filter[key] = value;
        }
    }

    req.query.filter = filter;
    next();
};


module.exports = {
    auth: auth,
    querystringParser: querystringParser,
    easyResponse: easyResponse,
    paginate: paginate,
    orderParser: orderParser,
    searchParser: searchParser,
    filter: filter,
};
