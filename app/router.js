var url = require('url');

var Router = function() {
    this._patterns = [];
};

Router.prototype.use = function(_regex, _cb) {
    var regex = null;
    var cb = null;
    if (_cb) {
        regex = _regex;
        cb = _cb;
    } else {
        regex = null;
        cb = _regex;
    }
    this._patterns.push([regex, cb]);
};

Router.prototype.post = function(regex, cb) {
    this._patterns.push([regex, cb, 'POST']);
};

Router.prototype.get = function(regex, cb) {
    this._patterns.push([regex, cb, 'GET']);
};

Router.prototype.put = function(regex, cb) {
    this._patterns.push([regex, cb, 'PUT']);
};

Router.prototype.delete = function(regex, cb) {
    this._patterns.push([regex, cb, 'DELETE']);
};

Router.prototype.dispatch = function(req, res, next) {
    var path = url.parse(req.url).pathname;
    var instance = this;

    var patternmatcher = function(sindex) {
        var matched = false;
        var index;

        var _next = function() {
            patternmatcher(index + 1);
        };

        for (index = sindex; index < instance._patterns.length; index++) {
            var pattern = instance._patterns[index];
            var regex = pattern[0];
            var method = pattern[2];

            // Skip if defined method is not matching with the incoming method.
            if (method && method !== req.method) {
                continue;
            }

            // Skip if defined regex is not matching with the incoming url.
            if (regex) {
                var exec = regex.exec(path);
                if (exec) {
                    req.params = exec.slice(1);
                } else {
                    continue;
                }
            }

            var cb = pattern[1];
            if (cb.constructor === Router) {
                cb.dispatch(req, res, _next);
            } else {
                cb(req, res, _next);
            }
            matched = true;
            break;
        }

        if (!matched) {
            next();
        }
    };
    patternmatcher(0);
};


module.exports = {
    Router: Router,
};
