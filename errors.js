var util = require('util');


var ValidationError = function ValidationError() {
    Error.call(this, arguments);
    this.message = this.message || "Invalid input.";
    this.errors = [];
    this.status = 400;
};

util.inherits(ValidationError, Error);

ValidationError.prototype.toJSON = function() {
    return {
        message: this.message,
        errors: this.errors,
    };
};

module.exports = {
    ValidationError: ValidationError,
};
