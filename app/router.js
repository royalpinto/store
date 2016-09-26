var url = require('url');


/**
 * Initialize a router.
 * @class
 * @memberof app
 * @classdesc A router class to route requests base on the url pattern
 * and request methods.
 */
var Router = function() {
    this._patterns = [];
};

/**
 * Add a function to be used (for all request methods) for all requests or for
 * a request with specific url pattern.
 * @param {RegExp} [_regex] A optional regex pattern to be matched with request url.
 * @param {Function} _cb A function or router to be invoked upon request.
 * This function will be invoked upon request with req, res and next parameter
 * by the dispatcher. Based on the scenarios, function has to either return a
 * response or has to invoke next callback.
 */
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

/**
 * Add a function to be used only for POST request with specific url pattern.
 * @param {RegExp} regex A regex pattern to be matched with request url.
 * @param {Function} cb A function or router to be invoked upon request.
 * This function will be invoked upon request with req, res and next parameter
 * by the dispatcher. Based on the scenarios, function has to either return a
 * response or has to invoke next callback.
 */
Router.prototype.post = function(regex, cb) {
    this._patterns.push([regex, cb, 'POST']);
};

/**
 * Add a function to be used only for GET request with specific url pattern.
 * @param {RegExp} regex A regex pattern to be matched with request url.
 * @param {Function} cb A function or router to be invoked upon request.
 */
Router.prototype.get = function(regex, cb) {
    this._patterns.push([regex, cb, 'GET']);
};

/**
 * Add a function to be used only for PUT request with specific url pattern.
 * @param {RegExp} regex A regex pattern to be matched with request url.
 * @param {Function} cb A function or router to be invoked upon request.
 */
Router.prototype.put = function(regex, cb) {
    this._patterns.push([regex, cb, 'PUT']);
};

/**
 * Add a function to be used only for DELETE request with specific url pattern.
 * @param {RegExp} regex A regex pattern to be matched with request url.
 * @param {Function} cb A function or router to be invoked upon request.
 */
Router.prototype.delete = function(regex, cb) {
    this._patterns.push([regex, cb, 'DELETE']);
};

/**
 * Dispatch request to routes configured.
 * Function from routes will be fetched (the order in which they have been added)
 * and executed. If function invokes next callback given, dispatcher will
 * continue with the next set of routes.
 * @param {Request} req A http(s) request object.
 * @param {Response} res A http(s) response object.
 * @param {Function} next A function to be invoked if none of the routes are
 * returning response.
 */
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
