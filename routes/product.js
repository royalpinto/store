var urls = require('./../app/router');
var router = new urls.Router();
var controller = require('../controllers/product');
var errors = require('./../errors');
var routes = require('./index');


router.post(/^\/products\//, routes.handlePermission('projects', 'write'));
router.put(/^\/products\//, routes.handlePermission('projects', 'write'));


router.get(/^\/products\/([a-fA-F\d]{24})\/$/, function(req, res) {
    var id = req.params[0];
    controller.getById(id)
    .then(function(product) {
        res.json(product);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/products\/$/, function(req, res) {
    var query = {name: req.query.search};
    controller
    .get(query, req.query.limit, req.query.skip, req.query.order)
    .then(function(product) {
        res.json(product);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.post(/^\/products\/$/, function(req, res) {
    controller
    .create(req.body)
    .then(function(product) {
        res.json(product);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.put(/^\/products\/([a-fA-F\d]{24})\/$/, function(req, res) {
    var id = req.params[0];
    controller
    .update(id, req.body)
    .then(function() {
        res.status(204).end();
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.delete(/^\/products\/([a-fA-F\d]{24})\/$/, function(req, res) {
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
