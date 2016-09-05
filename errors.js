var util = require('util');


var AppError = function AppError(message, error) {
    Error.call(this, message);
    this.message = message;
    this.error = error;
};

util.inherits(AppError, Error);

AppError.prototype.toJSON = function() {
    return {
        message: this.message,
        error: this.error,
    };
};


var ValidationError = function ValidationError(error) {
    AppError.call(this, "Invalid input.", error);
    this.status = 400;
};

util.inherits(ValidationError, AppError);


var UnauthorizedAccess = function UnauthorizedAccess(error) {
    AppError.call(this, "Unauthorized access.", error);
    this.status = 303;
};

util.inherits(UnauthorizedAccess, AppError);


var UnauthenticatedAccess = function UnauthenticatedAccess(error) {
    AppError.call(this, "Unauthenticated access.", error);
    this.status = 401;
};

util.inherits(UnauthenticatedAccess, AppError);


var handle = function(req, res, error) {
    if (error instanceof AppError) {
        return res.status(error.status).json(error);
    }
    console.trace(error);
    res.status(error.status || 500).json("Internal server error.");
};

module.exports = {
    ValidationError: ValidationError,
    UnauthorizedAccess: UnauthorizedAccess,
    UnauthenticatedAccess: UnauthenticatedAccess,
    AppError: AppError,
    handle: handle,
};
