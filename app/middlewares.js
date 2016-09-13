var fs = require('fs');
var url = require('url');
var path = require('path');
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
    req.query.search = {
        $in: _search.map(function(i) {
            return new RegExp(i, 'i');
        }),
    };
    next();
};


var serveStatic = function(dirname, prefix) {
    return function(req, res, next) {
        var uri = url.parse(req.url).pathname;
        var filename = path.join(dirname, prefix, uri);

        if (filename.endsWith('/')) {
            filename += 'index.html';
        }

        var extname = path.extname(filename);
        var contentType;
        switch (extname) {
            case '.html':
                contentType = 'text/html';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
            default:
                contentType = 'text/plain';
        }

        fs.exists(filename, function(exists) {
            if (!exists) {
                return next();
            }

            if (fs.statSync(filename).isDirectory()) {
                filename += '/index.html';
            }

            fs.readFile(filename, "binary", function(err, file) {
                if (err) {
                    res.writeHead(500, {"Content-Type": "text/plain"});
                    res.write(err + "\n");
                    res.end();
                    return;
                }

                res.writeHead(200, {"Content-Type": contentType});
                res.write(file, "binary");
                res.end();
            });
        });
    };
};


module.exports = {
    querystringParser: querystringParser,
    easyResponse: easyResponse,
    paginate: paginate,
    orderParser: orderParser,
    searchParser: searchParser,
    static: serveStatic,
};
