var urls = require('./../app/router');
var router = new urls.Router();
var controller = require('./../controllers/cartitem');
var errors = require('./../errors');
var middlewares = require('./middlewares');


router.use(/^\/api\/cart\/items\/$/, middlewares.auth());
router.use(/^\/api\/cart\/checkout\/$/, middlewares.auth());

router.get(/^\/api\/cart\/items\/$/, function(req, res) {
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

router.post(/^\/api\/cart\/items\/$/, function(req, res) {
    controller
    .create(req.session.user._id, req.body.projectId, req.body.quantity)
    .then(function() {
        res.setHeader('Location', "/api/cart/items/");
        res.status(201).json({});
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.put(/^\/api\/cart\/items\/$/, function(req, res) {
    controller
    .update(req.session.user._id, req.body.projectId, req.body.quantity)
    .then(function() {
        res.status(204).end();
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.delete(/^\/api\/cart\/items\/$/, function(req, res) {
    controller
    .remove(req.session.user._id, req.query.projectId)
    .then(function() {
        res.status(204).end();
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.post(/^\/api\/cart\/checkout\/$/, function(req, res) {
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
