var express = require('express');
var router = new express.Router();
var Category = require('./../models/category');


/**
 * @api {get} /api/categories/ Get categories
 * @apiName GetCategories
 * @apiGroup Category
 *
 * @apiParam {String} [search] Optional search filter
 * @apiParam {Number} [limit=10] Limit number of records to be fetched
 * @apiParam {Number} [page=1] Page number
 *
 * @apiSuccess (Success 200) {Object[]} categories Categories
 * @apiSuccess (Success 200) {String} category.id Category id
 * @apiSuccess (Success 200) {String} category.name Category name
 */
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
