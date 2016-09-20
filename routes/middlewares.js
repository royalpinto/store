var authController = require('../controllers/auth');
var errors = require('./../errors');


var auth = function(noun, verb) {
    return function(req, res, next) {
        if (!req.session.user) {
            var error = new errors.UnauthenticatedAccess();
            return errors.handle(req, res, error);
        }

        if (!(noun && verb)) {
            return next();
        }

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
    };
};


module.exports = {
    auth: auth,
};
