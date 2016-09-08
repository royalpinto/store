var urls = require('./../app/router');
var router = new urls.Router();
var routes = require('./index');
var controller = require('../controllers/user');
var errors = require('./../errors');


// This route can be accessed only by admins.
router.use(/^\/users\//, routes.handlePermission('users', 'readwrite'));


router.get(/^\/users\/([a-fA-F\d]{24})\/$/, function(req, res) {
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

router.get(/^\/users\/$/, function(req, res) {
    var query = {name: req.query.search};
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

router.delete(/^\/users\/([a-fA-F\d]{24})\/$/, function(req, res) {
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
