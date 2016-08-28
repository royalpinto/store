var express = require('express');
var router = new express.Router();
var Product = require('./../models/product');
var roles = require('./../roles');

var authorize = roles.authorize;


/* POST method create a product. */
router.post('/', authorize('products', 'create'), function(req, res, next) {
    var product = new Product(req.body);

    // save the product and check for errors
    product.save(function(err) {
        if (err) {
            return next(err);
        }

        res.json(product);
    });
});

/* GET method to fetch products. */
router.get('/', function(req, res, next) {
    var search = req.query.search;
    Product.find({
        name: search ? new RegExp(search, 'i') : null,
    }, null, {
        skip: req.skip,
        limit: req.query.limit,
    }, function(err, products) {
        if (err) {
            return next(err);
        }

        return res.json(products);
    })
    ;
});

/* GET method to get a product. */
router.get('/:id/', function(req, res, next) {
    // Check if id is in expected format.
    // If not, doesn't have to go to the db.
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).send("Not found");
    }

    Product.findById(req.params.id, function(err, product) {
        if (err) {
            return next(err);
        }

        if (!product) {
            return res.status(404).send("Not found");
        }

        res.json(product);
    });
});

/* PUT method to update a product. */
router.put('/:id/', authorize('products', 'edit'), function(req, res, next) {
    Product.findByIdAndUpdate(req.params.id, req.body, function(err, product) {
        if (err) {
            return next(err);
        }

        if (!product) {
            return res.status(404).send("Not found");
        }

        res.status(204).send();
    });
});

/* DELETE method to delete a product. */
router.delete('/:id/', authorize('products', 'delete'), function(req, res, next) {
    Product.findByIdAndRemove(req.params.id, function(err, product) {
        if (err) {
            return next(err);
        }

        if (!product) {
            return res.status(404).send("Not found");
        }

        res.status(204).send();
    });
});


module.exports = router;
