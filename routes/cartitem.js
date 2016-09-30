'use strict';


const urls = require('./../app/router');
const router = new urls.Router();
const Controller = require('./../controllers/cartitem');
const controller = new Controller();
const errors = require('./../errors');
const middlewares = require('./middlewares');


router.use(/^\/api\/cart\/items\/$/, middlewares.auth());
router.use(/^\/api\/cart\/checkout\/$/, middlewares.auth());

router.get(/^\/api\/cart\/items\/$/, (req, res) => {
    controller
    .get(req.session.user._id)
    .then(cart => {
        res.json(cart);
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.post(/^\/api\/cart\/items\/$/, (req, res) => {
    controller
    .create(req.session.user._id, req.body.productId, req.body.quantity)
    .then(() => {
        res.setHeader('Location', "/api/cart/items/");
        res.status(201).json({});
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.put(/^\/api\/cart\/items\/$/, (req, res) => {
    controller
    .update(req.session.user._id, req.body.productId, req.body.quantity)
    .then(() => {
        res.status(204).end();
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.delete(/^\/api\/cart\/items\/$/, (req, res) => {
    controller
    .remove(req.session.user._id, req.query.productId)
    .then(() => {
        res.status(204).end();
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.post(/^\/api\/cart\/checkout\/$/, (req, res) => {
    controller
    .checkout(req.session.user._id)
    .then(() => {
        res.status(204).end();
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

module.exports = router;
