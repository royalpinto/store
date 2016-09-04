var util = require('util');


var ValidationError = function ValidationError(message) {
    Error.call(this, arguments);
    this.message = "Invalid input.";
    this.error = message;
    this.status = 400;
};

util.inherits(ValidationError, Error);

ValidationError.prototype.toJSON = function() {
    return {
        message: this.message,
        error: this.error,
    };
};

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
