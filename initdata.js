var models = require('./models');

// Initialize database with initial setup
// like default user and permissions etc...
module.exports = function init() {
    return Promise.all([
        // Products read is allowed for all users.
        // Write is permitted only for admins.
        models.Permission.add("admin", "projects", "write"),

        // Users is allowed only for administrators.
        models.Permission.add("admin", "users", "read"),
        models.Permission.add("admin", "users", "write"),
    ])
    .then(function() {
        return;
    })
    ;
};
