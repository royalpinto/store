var urls = require('./../app/router');
var router = new urls.Router();
var middlewares = require('./middlewares');
var Controller = require('../controllers/user');
var controller = new Controller();
var errors = require('./../errors');
var auth = require('../controllers/auth');


// This route can be accessed only logged in users.
router.use(/^\/api\/users\//, middlewares.auth());
router.get(/^\/api\/users\/$/, middlewares.auth('users', 'read'));


router.get(/^\/api\/users\/([a-fA-F\d]{24})\/$/, function(req, res) {
    var id = req.params[0];
    Promise.resolve(id === req.session.user._id)
    .then(function(permit) {
        return permit ||
            auth.hasPermission(req.session.user._id, 'users', 'read');
    })
    .then(function(permit) {
        if (!permit) {
            throw new errors.UnauthorizedAccess();
        }
        return controller.getById(id);
    })
    .then(function(user) {
        res.json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/api\/users\/$/, function(req, res) {
    var filter = req.query.filter;
    if (req.query.search) {
        filter.name = req.query.search;
    }
    controller
    .get(filter, req.query.limit, req.query.skip, req.query.order)
    .then(function(user) {
        res.json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.put(/^\/api\/users\/([a-fA-F\d]{24})\/$/, function(req, res) {
    var id = req.params[0];
    Promise.resolve(id === req.session.user._id)
    .then(function(permit) {
        if (!permit) {
            throw new errors.UnauthorizedAccess();
        }
        return controller.update(id);
    })
    .then(function(user) {
        res.json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.delete(/^\/api\/users\/([a-fA-F\d]{24})\/$/, function(req, res) {
    var id = req.params[0];
    Promise.resolve(id === req.session.user._id)
    .then(function(permit) {
        return permit ||
            auth.hasPermission(req.session.user._id, 'users', 'write');
    })
    .then(function(permit) {
        if (!permit) {
            throw new errors.UnauthorizedAccess();
        }
        return controller.remove(id, req.body);
    })
    .then(function() {
        res.status(204).end();
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});


module.exports = router;
