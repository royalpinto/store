var util = require('util');
var models = require('./../models');
var Controller = require('./controller');


var ProductController = function() {
    Controller.call(this, models.Product);
};

util.inherits(ProductController, Controller);


ProductController.prototype.create = function(data) {
    delete data.imgsrc;
    return Controller.prototype.create.call(this, data);
};

ProductController.prototype.update = function(id, data) {
    delete data.imgsrc;
    return Controller.prototype.update.call(this, id, data);
};

ProductController.prototype.getCategories =
function(query, limit, skip, order) {
    var pipeline = [{
        $match: query,
    }, {
        $group: {
            _id: '$category',
        },
    }];

    var countPipeline = pipeline.slice();
    Array.prototype.push.apply(countPipeline, [
        {$group: {_id: 1, sum: {$sum: 1}}},
        {$project: {sum: 1, _id: 0}},
    ]);

    if (Object.keys(order).length === 0) {
        order.name = 1;
    }

    Array.prototype.push.apply(pipeline, [
        {$project: {name: '$_id', _id: 0}},
        {$sort: order},
        {$skip: skip},
        {$limit: limit},
    ]);

    return Promise.all([
        models.Product.collection
        .aggregate(countPipeline)
        .toArray(),
        models.Product.collection
        .aggregate(pipeline)
        .toArray(),
    ])
    .then(function(values) {
        var countData = values[0];
        var count = countData.length > 0 ? countData[0].sum : 0;
        var data = values[1];
        return {
            count: count,
            data: data,
        };
    })
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
    }];

    var countPipeline = pipeline.slice();
    Array.prototype.push.apply(countPipeline, [
        {$group: {_id: 1, sum: {$sum: 1}}},
        {$project: {sum: 1, _id: 0}},
    ]);

    if (Object.keys(order).length === 0) {
        order.name = 1;
    }

    Array.prototype.push.apply(pipeline, [
        {$project: {name: '$_id', _id: 0}},
        {$sort: order},
        {$skip: skip},
        {$limit: limit},
    ]);

    return Promise.all([
        models.Product.collection
        .aggregate(countPipeline)
        .toArray(),
        models.Product.collection
        .aggregate(pipeline)
        .toArray(),
    ])
    .then(function(values) {
        var countData = values[0];
        var count = countData.length > 0 ? countData[0].sum : 0;
        var data = values[1];
        return {
            count: count,
            data: data,
        };
    })
    ;
};


module.exports = new ProductController();
