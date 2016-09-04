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


var handle = function(req, res, error) {
    if (error instanceof ValidationError) {
        return res.status(error.status).json(error);
    }
    console.trace(error);
    res.status(error.status || 500).json("Internal server error.");
};

module.exports = {
    ValidationError: ValidationError,
    handle: handle,
};
