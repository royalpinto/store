var urls = require('./../app/router');
var router = new urls.Router();
var middlewares = require('./middlewares');
var controller = require('../controllers/user');
var errors = require('./../errors');


// This route can be accessed only by admins.
router.post(/^\/api\/users\//, middlewares.auth('users', 'write'));
router.put(/^\/api\/users\//, middlewares.auth('users', 'write'));
router.delete(/^\/api\/users\//, middlewares.auth('users', 'write'));
router.get(/^\/api\/users\//, middlewares.auth('users', 'read'));


router.get(/^\/api\/users\/([a-fA-F\d]{24})\/$/, function(req, res) {
    var id = req.params[0];
    controller.getById(id)
    .then(function(user) {
        res.json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/api\/users\/$/, function(req, res) {
    var query = {};
    if (req.query.search) {
        query.name = req.query.search;
    }
    controller
    .get(query, req.query.limit, req.query.skip, req.query.order)
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
    controller
    .remove(id, req.body)
    .then(function() {
        res.status(204).end();
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});


module.exports = router;
