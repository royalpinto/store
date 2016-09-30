'use strict';


const url = require('url');


/**
 * @class
 * @memberof app
 * @classdesc A router class to route requests base on the url pattern
 * and request methods.
 */
class Router {

    /**
     * Initialize a router.
     */
    constructor() {
        this._patterns = [];
    }

    /**
     * Add a function to be used (for all request methods) for all requests or for
     * a request with specific url pattern.
     * @param {RegExp} [_regex] A optional regex pattern to be matched with request url.
     * @param {Function} _cb A function or router to be invoked upon request.
     * This function will be invoked upon request with req, res and next parameter
     * by the dispatcher. Based on the scenarios, function has to either return a
     * response or has to invoke next callback.
     */
    use(_regex, _cb) {
        let regex = null;
        let cb = null;
        if (_cb) {
            regex = _regex;
            cb = _cb;
        } else {
            regex = null;
            cb = _regex;
        }
        this._patterns.push([regex, cb]);
    }

    /**
     * Add a function to be used only for POST request with specific url pattern.
     * @param {RegExp} regex A regex pattern to be matched with request url.
     * @param {Function} cb A function or router to be invoked upon request.
     * This function will be invoked upon request with req, res and next parameter
     * by the dispatcher. Based on the scenarios, function has to either return a
     * response or has to invoke next callback.
     */
    post(regex, cb) {
        this._patterns.push([regex, cb, 'POST']);
    }

    /**
     * Add a function to be used only for GET request with specific url pattern.
     * @param {RegExp} regex A regex pattern to be matched with request url.
     * @param {Function} cb A function or router to be invoked upon request.
     */
    get(regex, cb) {
        this._patterns.push([regex, cb, 'GET']);
    }

    /**
     * Add a function to be used only for PUT request with specific url pattern.
     * @param {RegExp} regex A regex pattern to be matched with request url.
     * @param {Function} cb A function or router to be invoked upon request.
     */
    put(regex, cb) {
        this._patterns.push([regex, cb, 'PUT']);
    }

    /**
     * Add a function to be used only for DELETE request with specific url pattern.
     * @param {RegExp} regex A regex pattern to be matched with request url.
     * @param {Function} cb A function or router to be invoked upon request.
     */
    delete(regex, cb) {
        this._patterns.push([regex, cb, 'DELETE']);
    }

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
    dispatch(req, res, next) {
        let path = url.parse(req.url).pathname;

        let patternmatcher = sindex => {
            let matched = false;
            let index;

            let _next = () => {
                patternmatcher(index + 1);
            };

            for (index = sindex; index < this._patterns.length; index++) {
                let pattern = this._patterns[index];
                let regex = pattern[0];
                let method = pattern[2];

                // Skip if defined method is not matching with the incoming method.
                if (method && method !== req.method) {
                    continue;
                }

                // Skip if defined regex is not matching with the incoming url.
                if (regex) {
                    let exec = regex.exec(path);
                    if (exec) {
                        req.params = exec.slice(1);
                    } else {
                        continue;
                    }
                }

                let cb = pattern[1];
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
    }

}


module.exports = {
    Router: Router,
};
