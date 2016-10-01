'use strict';


/**
 * @module errors
 * @namespace errors
 */

const logging = require('./logging');


/**
 * @class
 * @memberof errors
 * @classdesc A base class for all custom errors which app can throw.
 */
class AppError extends Error {

    /**
     * Initialize AppError.
     * @param {String} message The beutified error message.
     * @param {String} error The internal error.
     */
    constructor(message, error) {
        super(message);
        this.message = message;
        this.error = error;
    }

    /**
     * Convert instance to plain JavaScript object.
     * @return {Object} A plain JavaScript object.
     */
    toJSON() {
        return {
            message: this.message,
            error: this.error,
        };
    }

}


/**
 * @class
 * @extends errors.AppError
 * @memberof errors
 * @classdesc A class for validations errors which app can throw.
 */
class ValidationError extends AppError {

    /**
     * Initialize a ValidationError.
     * @param {String} error The internal error.
     */
    constructor(error) {
        super("Invalid input.", error);
        this.status = 400;
    }

}


/**
 * @class
 * @extends errors.AppError
 * @memberof errors
 * @classdesc A error class app can throw for unauthorized access .
 */
class UnauthorizedAccess extends AppError {

    /**
     * Initialize a unauthorized access error.
     * @param {String} error The internal error.
     */
    constructor(error) {
        super("Unauthorized access.", error);
        this.status = 403;
    }

}


/**
 * @class
 * @extends errors.AppError
 * @memberof errors
 * @classdesc A error class app can throw for unauthenticated access .
 */
class UnauthenticatedAccess extends AppError {

    /**
     * Initialize a unauthenticated access error.
     * @param {String} error The internal error.
     */
    constructor(error) {
        super("Unauthenticated access.", error);
        this.status = 401;
    }

}


class Conflict extends AppError {

    constructor(error) {
        super("Duplicate resource.", error);
        this.status = 409;
    }

}


/**
 * An error handler middleware: returns a curried `handle` function, which can
 * be called with an error to be handled and send appropriate response to
 * the client.
 * @param {Request} req A http(s) request object.
 * @param {Response} res A http(s) response object.
 * @memberof errors
 * @return {Function} Curried handle function which can be called with an error.
 */
const handler = (req, res) => {
    return error => {
        let username = null;
        if (req.session && req.session.user) {
            username = req.session.user.username;
        }
        if (error instanceof AppError) {
            logging.warn(error, {username: username});
            return res.status(error.status).json(error);
        }
        logging.error(error, {username: username});
        res.status(error.status || 500).end("Internal server error.");
    };
};

module.exports = {
    ValidationError: ValidationError,
    UnauthorizedAccess: UnauthorizedAccess,
    UnauthenticatedAccess: UnauthenticatedAccess,
    Conflict: Conflict,
    AppError: AppError,
    handler: handler,
};
