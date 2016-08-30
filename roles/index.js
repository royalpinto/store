var acl = require('acl');
var mongoose = require('mongoose');


/* eslint-disable new-cap */
var roles = new acl(
    new acl.mongodbBackend(mongoose.connection.db, 'roles_')
);
/* eslint-enable */


// Initialize roles once db connection has been established.
mongoose.connection.on('connected', function() {
    roles.backend.db = mongoose.connection.db;
    roles.allow([{
        roles: ['member'],
        allows: [{
            resources: 'products',
            permissions: ['read'],
        }, {
            resources: 'cart',
            permissions: '*',
        }],
    }, {
        roles: ['admin'],
        allows: [{
            resources: 'products',
            permissions: '*',
        }],
    }]);
});


roles.authorize = function(resource, permissions) {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            roles.isAllowed(req.user.username, resource, permissions,
                function(err, allowed) {
                    if (err) {
                        return next(err);
                    }

                    if (!allowed) {
                        return res.status(403).send();
                    }

                    next();
                }
            );
        } else {
            return res.status(401).send();
        }
    };
};


module.exports = roles;
