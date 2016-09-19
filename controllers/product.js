var util = require('util');
var models = require('./../models');
var Controller = require('./controller');


var ProductController = function() {
    Controller.call(this, models.Product);
};

util.inherits(ProductController, Controller);


ProductController.prototype.getCategories =
function(query, limit, skip, order) {
    var pipeline = [{
        $match: query,
    }, {
        $group: {
            _id: '$category',
        },
    }, {
        $project: {
            name: '$_id', _id: 0,
        },
    }];

    if (Object.keys(order).length === 0) {
        order.name = 1;
    }

    pipeline.push({$sort: order});

    pipeline.push({
        $skip: skip,
    });

    pipeline.push({
        $limit: limit,
    });

    return models.Product.collection
    .aggregate(pipeline)
    .toArray()
    ;
};

ProductController.prototype.getBrands =
function(query, limit, skip, order) {
    var pipeline = [{
        $match: query,
    }, {
        $group: {
            _id: '$brand',
        },
    }, {
        $project: {
            name: '$_id', _id: 0,
        },
    }];

    if (Object.keys(order).length === 0) {
        order.name = 1;
    }

    pipeline.push({$sort: order});

    pipeline.push({
        $skip: skip,
    });

    pipeline.push({
        $limit: limit,
    });

    return models.Product.collection
    .aggregate(pipeline)
    .toArray()
    ;
};


module.exports = new ProductController();
