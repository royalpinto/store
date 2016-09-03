var util = require('util');

var ValidationError = function() {
    Error.call(this, arguments);
};

util.inherits(ValidationError, Error);


module.exports = {
    required: function(value, key) {
        if (value) {
            return;
        }
        return util.format("%s is required.", key);
    },
    email: function(value, key) {
        if (value) {
            return;
        }
        return util.format("Invalid %s.", key);
    },
    string: function(min, max) {
        return function(value, key) {
            if (!value) {
                return util.format("%s is required.", key);
            }

            if (min && value.length < min) {
                return util.format("%s is too small.", key);
            }

            if (max && value.length > max) {
                return util.format("%s is too small.", key);
            }
        };
    },
};
