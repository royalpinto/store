/**
 * @module errors
 * @namespace errors
 */

var util = require('util');
var logging = require('./logging');


/**
 * Initialize a AppError.
 * @param {String} message The beutified error message.
 * @param {String} error The internal error.
 * @class
 * @memberof errors
 * @classdesc A base class for all custom errors which app can throw.
 */
var AppError = function AppError(message, error) {
    Error.call(this, message);
    this.message = message;
    this.error = error;
};

util.inherits(AppError, Error);

/**
 * Convert instance to plain JavaScript object.
 * @return {Object} A plain JavaScript object.
 */
AppError.prototype.toJSON = function() {
    return {
        message: this.message,
        error: this.error,
    };
};


/**
 * Initialize a ValidationError.
 * @param {String} error The internal error.
 * @class
 * @extends errors.AppError
 * @memberof errors
 * @classdesc A class for validations errors which app can throw.
 */
var ValidationError = function ValidationError(error) {
    AppError.call(this, "Invalid input.", error);
    this.status = 400;
};

util.inherits(ValidationError, AppError);


/**
 * Initialize a unauthorized access error.
 * @param {String} error The internal error.
 * @class
 * @extends errors.AppError
 * @memberof errors
 * @classdesc A error class app can throw for unauthorized access .
 */
var UnauthorizedAccess = function UnauthorizedAccess(error) {
    AppError.call(this, "Unauthorized access.", error);
    this.status = 403;
};

util.inherits(UnauthorizedAccess, AppError);


/**
 * Initialize a unauthenticated access error.
 * @param {String} error The internal error.
 * @class
 * @extends errors.AppError
 * @memberof errors
 * @classdesc A error class app can throw for unauthenticated access .
 */
var UnauthenticatedAccess = function UnauthenticatedAccess(error) {
    AppError.call(this, "Unauthenticated access.", error);
    this.status = 401;
};

util.inherits(UnauthenticatedAccess, AppError);


var Conflict = function Conflict(error) {
    AppError.call(this, "Duplicate resource.", error);
    this.status = 409;
};

util.inherits(Conflict, AppError);


/**
 * A error handler middlware: checks if error is thrown from the App or from an
 * internal library, then returns a customized error message to the client with
 * an appropriate status.
 * @param {Request} req A http(s) request object.
 * @param {Response} res A http(s) response object.
 * @param {Error} error Error to be handled.
 * @return {null} null
 */
var handle = function(req, res, error) {
    var username = null;
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

module.exports = {
    ValidationError: ValidationError,
    UnauthorizedAccess: UnauthorizedAccess,
    UnauthenticatedAccess: UnauthenticatedAccess,
    Conflict: Conflict,
    AppError: AppError,
    handle: handle,
};
