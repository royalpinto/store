var express = require('express');
var router = new express.Router();
var Category = require('./../models/category');


/* GET method to fetch categories. */
router.get('/', function(req, res, next) {
    var filter = {};
    var search = req.query.search;
    if (search) {
        filter.name = new RegExp(search, 'i');
    }

    Category.find(filter, null, {
        skip: req.skip,
        limit: req.query.limit,
    }, function(err, categories) {
        if (err) {
            return next(err);
        }

        return res.json(categories);
    })
    ;
});


module.exports = router;
