var authController = require('../controllers/auth');
var errors = require('./../errors');


var handlePermission = function(noun, verb) {
    return function(req, res, next) {
        if (req.session.user) {
            authController
            .hasPermission(req.session.user._id, noun, verb)
            .then(function(permit) {
                if (permit) {
                    next();
                } else {
                    var error = new errors.UnauthorizedAccess();
                    errors.handle(req, res, error);
                }
            })
            .catch(function(error) {
                errors.handle(req, res, error);
            })
            ;
        } else {
            var error = new errors.UnauthenticatedAccess();
            errors.handle(req, res, error);
        }
    };
};


module.exports = {
    handlePermission: handlePermission,
};
