var express = require('express');
var router = new express.Router();
var Product = require('./../models/product');
var roles = require('./../roles');

var authorize = roles.authorize;


/**
 * @api {post} /api/products/ Create a product
 * @apiName CreateProduct
 * @apiGroup Product
 *
 * @apiParam {String} name Product name
 * @apiParam {String} code Product code
 * @apiParam {Number} price Product price
 * @apiParam {String} description Product description
 * @apiParam {String} category Product category
 * @apiParam {String} [rating] Product rating
 *
 * @apiSuccess (Success 201) {Header} Location URI of the created product
 */
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

/**
 * @api {get} /api/products/ Get products
 * @apiName GetProducts
 * @apiGroup Product
 *
 * @apiParam {String} [search] Optional search filter
 * @apiParam {String} [category] Optional category filter
 * @apiParam {Number} [limit=10] Limit number of records to be fetched
 * @apiParam {Number} [page=1] Page number
 *
 * @apiSuccess (Success 200) {Object[]} products List of products
 * @apiSuccess (Success 200) {String} products.id Product id
 * @apiSuccess (Success 200) {String} products.name Product name
 * @apiSuccess (Success 200) {String} products.code Product code
 * @apiSuccess (Success 200) {Number} products.price Product price
 * @apiSuccess (Success 200) {String} products.description Product description
 * @apiSuccess (Success 200) {String} products.category Product category
 * @apiSuccess (Success 200) {String} products.rating Product rating
 * @apiSuccess (Success 200) {String} products.thumbnail Product thumbnail
 */
router.get('/', function(req, res, next) {
    var filter = {};
    var search = req.query.search;
    if (search) {
        filter.name = new RegExp(search, 'i');
    }

    Product.find(filter, null, {
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

/**
 * @api {get} /api/products/:id/ Get a product
 * @apiName GetProduct
 * @apiGroup Product
 *
 * @apiSuccess (Success 200) {String} id Product id
 * @apiSuccess (Success 200) {String} name Product name
 * @apiSuccess (Success 200) {String} code Product code
 * @apiSuccess (Success 200) {Number} price Product price
 * @apiSuccess (Success 200) {String} description Product description
 * @apiSuccess (Success 200) {String} category Product category
 * @apiSuccess (Success 200) {String} rating Product rating
 * @apiSuccess (Success 200) {String} thumbnail Product thumbnail
 */
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

/**
 * @api {put} /api/products/:id/ Update a product
 * @apiName UpdateProduct
 * @apiGroup Product
 *
 * @apiParam {String} [name] Product name
 * @apiParam {String} [code] Product code
 * @apiParam {Number} [price] Product price
 * @apiParam {String} [description] Product description
 * @apiParam {String} [category] Product category
 * @apiParam {String} [rating] Product rating
 *
 * @apiSuccess (Success 204) {Header} 204 No Content
 */
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

/**
 * @api {delete} /api/products/:id/ Delete a product
 * @apiName DeleteProduct
 * @apiGroup Product
 *
 * @apiSuccess (Success 204) {Header} 204 No Content
 */
router.delete('/:id/', authorize('products', 'delete'),
    function(req, res, next) {
        Product.findByIdAndRemove(req.params.id, function(err, product) {
            if (err) {
                return next(err);
            }

            if (!product) {
                return res.status(404).send("Not found");
            }

            res.status(204).send();
        });
    }
);


module.exports = router;
