var urls = require('./../app/router');
var router = new urls.Router();
var controller = require('./../controllers/cartitem');
var errors = require('./../errors');
var routes = require('./index');


router.use(/^\/cart\/items\/$/, routes.handlePermission());
router.use(/^\/cart\/checkout\/$/, routes.handlePermission());

router.get(/^\/cart\/items\/$/, function(req, res) {
    controller
    .get(req.session.user._id)
    .then(function(cart) {
        res.json(cart);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.post(/^\/cart\/items\/$/, function(req, res) {
    controller
    .create(req.session.user._id, req.body.projectId, req.body.quantity)
    .then(function() {
        res.status(204).end();
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.put(/^\/cart\/items\/$/, function(req, res) {
    controller
    .update(req.session.user._id, req.body.projectId, req.body.quantity)
    .then(function(cart) {
        res.json(cart);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.delete(/^\/cart\/items\/$/, function(req, res) {
    controller
    .remove(req.session.user._id, req.query.projectId)
    .then(function(cart) {
        res.json(cart);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.post(/^\/cart\/checkout\/$/, function(req, res) {
    controller
    .checkout(req.session.user._id)
    .then(function() {
        res.status(204).end();
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

module.exports = router;
