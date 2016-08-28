var acl = require('acl');
var mongoose = require('mongoose');


/* eslint-disable new-cap */
var roles = new acl(
    new acl.mongodbBackend(mongoose.connection.db, 'roles_')
);
/* eslint-enable */


roles.allow([
    {
        roles: ['guest', 'member'],
        allows: [
            {
                resources: 'products',
                permissions: ['get'],
            },
        ],
    },
]);


roles.authorize = function(resource, permissions) {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            roles.areAnyRolesAllowed('member', resource, permissions,
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
