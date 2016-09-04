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

module.exports = {
    ValidationError: ValidationError,
};
