var util = require('util');
var urls = require('./../app/router');
var router = new urls.Router();
var controller = require('../controllers/product');
var errors = require('./../errors');
var middlewares = require('./middlewares');


router.post(/^\/api\/products\//, middlewares.auth('projects', 'write'));
router.put(/^\/api\/products\//, middlewares.auth('projects', 'write'));


router.get(/^\/api\/products\/([a-fA-F\d]{24})\/$/, function(req, res) {
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

router.get(/^\/api\/products\/$/, function(req, res) {
    var filter = req.query.filter;
    if (req.query.search) {
        filter.name = req.query.search;
    }
    controller
    .get(filter, req.query.limit, req.query.skip, req.query.order)
    .then(function(product) {
        res.json(product);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.post(/^\/api\/products\/$/, function(req, res) {
    controller
    .create(req.body)
    .then(function(product) {
        res.setHeader('Location',
            util.format("/api/products/%s/", product._id));
        res.status(201).json(product);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.put(/^\/api\/products\/([a-fA-F\d]{24})\/$/, function(req, res) {
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

router.delete(/^\/api\/products\/([a-fA-F\d]{24})\/$/, function(req, res) {
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

router.get(/^\/api\/products\/categories\//, function(req, res) {
    var filter = req.query.filter;
    if (req.query.search) {
        filter.category = req.query.search;
    }
    controller
    .getCategories(filter, req.query.limit, req.query.skip, req.query.order)
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/api\/products\/brands\//, function(req, res) {
    var filter = req.query.filter;
    if (req.query.search) {
        filter.brand = req.query.search;
    }
    controller
    .getBrands(filter, req.query.limit, req.query.skip, req.query.order)
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});


module.exports = router;
