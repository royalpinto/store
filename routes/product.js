'use strict';


const util = require('util');
const urls = require('./../app/router');
const router = new urls.Router();
const Controller = require('../controllers/product');
const controller = new Controller();
const errors = require('./../errors');
const middlewares = require('./middlewares');


router.post(/^\/api\/products\//, middlewares.auth('products', 'write'));
router.put(/^\/api\/products\//, middlewares.auth('products', 'write'));


router.get(/^\/api\/products\/([a-fA-F\d]{24})\/$/, (req, res) => {
    let id = req.params[0];
    controller.getById(id)
    .then(product => {
        res.json(product);
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/api\/products\/$/, (req, res) => {
    let filter = req.query.filter;
    if (req.query.search) {
        filter.name = req.query.search;
    }
    controller
    .get(filter, req.query.limit, req.query.skip, req.query.order)
    .then(product => {
        res.json(product);
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.post(/^\/api\/products\/$/, (req, res) => {
    controller
    .create(req.body)
    .then(product => {
        res.setHeader('Location',
            util.format("/api/products/%s/", product._id));
        res.status(201).json(product);
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.put(/^\/api\/products\/([a-fA-F\d]{24})\/$/, (req, res) => {
    let id = req.params[0];
    controller
    .update(id, req.body)
    .then(() => {
        res.status(204).end();
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.delete(/^\/api\/products\/([a-fA-F\d]{24})\/$/, (req, res) => {
    let id = req.params[0];
    controller
    .remove(id, req.body)
    .then(() => {
        res.status(204).end();
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/api\/products\/categories\//, (req, res) => {
    let filter = req.query.filter;
    if (req.query.search) {
        filter.category = req.query.search;
    }
    controller
    .getCategories(filter, req.query.limit, req.query.skip, req.query.order)
    .then(data => {
        res.json(data);
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/api\/products\/brands\//, (req, res) => {
    let filter = req.query.filter;
    if (req.query.search) {
        filter.brand = req.query.search;
    }
    controller
    .getBrands(filter, req.query.limit, req.query.skip, req.query.order)
    .then(data => {
        res.json(data);
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});


module.exports = router;
