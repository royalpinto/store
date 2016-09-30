'use strict';


const url = require('url');
const querystring = require('querystring');
const Controller = require('./../controllers/user');
const authController = new Controller();
const errors = require('./../errors');


const auth = (noun, verb) => {
    return (req, res, next) => {
        if (!req.session.user) {
            let error = new errors.UnauthenticatedAccess();
            return errors.handle(req, res, error);
        }

        if (!(noun && verb)) {
            return next();
        }

        authController
        .hasPermission(req.session.user._id, noun, verb)
        .then(permit => {
            if (permit) {
                next();
            } else {
                let error = new errors.UnauthorizedAccess();
                errors.handle(req, res, error);
            }
        })
        .catch(error => {
            errors.handle(req, res, error);
        })
        ;
    };
};


const easyResponse = (req, res, next) => {
    res.json = data => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    };

    res.status = status => {
        res.statusCode = status;
        return res;
    };

    next();
};

const querystringParser = (req, res, next) => {
    req.query = querystring.parse(url.parse(req.url).query);
    next();
};


const _parseNumber = (value, defaultValue, max) => {
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

const paginate = (deafultLimit, maxLimit) => {
    return (req, res, next) => {
        req.query.limit = _parseNumber(req.query.limit, deafultLimit, maxLimit);
        req.query.skip = _parseNumber(req.query.skip, 0);
        next();
    };
};


const orderParser = (req, res, next) => {
    let order = {};
    let _order = req.query.order;

    if (!(_order instanceof Array)) {
        _order = [_order];
    }

    for (let i = 0; i < _order.length; i++) {
        let orderItem = _order[i];
        let field;
        let direction;
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


const searchParser = (req, res, next) => {
    let _search = req.query.search;
    if (!(_search instanceof Array)) {
        _search = [_search];
    }
    let search = [];
    _search.forEach(i => {
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


const filter = (req, res, next) => {
    let filter = {};
    for (let key in req.query) {
        if (!key) {
            continue;
        }
        if (['search', 'limit', 'skip', 'order'].indexOf(key) > -1) {
            continue;
        }
        let value = req.query[key];
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
