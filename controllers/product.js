'use strict';


const models = require('./../models');
const Controller = require('./controller');


/**
 * @extends controllers.Controller
 * @memberof controllers
 * @class
 * @classdesc A product controller with methods to manage products.
 */
class ProductController extends Controller {

    constructor() {
        super(models.Product);
    }

    /**
     * Create a product from the given data.
     * @param {Object} data The data to be set to the product.
     * @return {Promise} A promise which resolves upon creation.
     */
    create(data) {
        delete data.imgsrc;
        return Controller.prototype.create.call(this, data);
    }

    /**
     * Update a product with given data.
     * @param {String/ObjectID} id The model id.
     * @param {Object} data The data to be updated.
     * @return {Promise} A promise which resolves upon completion.
     */
    update(id, data) {
        delete data.imgsrc;
        return Controller.prototype.update.call(this, id, data);
    }

    /**
     * Fetch categories for the given query.
     * @param {Query} query Query according to the mongodb native nodejs driver spec.
     * @param {Number} limit Limit by number of  categories to be fetched.
     * @param {Number} skip Skip number of categories to be fetched.
     * @param {Order} order Order according to the mongodb native nodejs driver spec.
     * @return {Promise} A promise which resolves with categories and count upon
     * completion.
     */
    getCategories(query, limit, skip, order) {
        let pipeline = [{
            $match: query,
        }, {
            $group: {
                _id: '$category',
            },
        }];

        let countPipeline = pipeline.slice();
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
        .then(values => {
            let countData = values[0];
            let count = countData.length > 0 ? countData[0].sum : 0;
            let data = values[1];
            return {
                count: count,
                data: data,
            };
        })
        ;
    }

    /**
     * Fetch brands for the given query.
     * @param {Query} query Query according to the mongodb native nodejs driver spec.
     * @param {Number} limit Limit by number of  brands to be fetched.
     * @param {Number} skip Skip number of brands to be fetched.
     * @param {Order} order Order according to the mongodb native nodejs driver spec.
     * @return {Promise} A promise which resolves with brands and count upon
     * completion.
     */
    getBrands(query, limit, skip, order) {
        let pipeline = [{
            $match: query,
        }, {
            $group: {
                _id: '$brand',
            },
        }];

        let countPipeline = pipeline.slice();
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
        .then(values => {
            let countData = values[0];
            let count = countData.length > 0 ? countData[0].sum : 0;
            let data = values[1];
            return {
                count: count,
                data: data,
            };
        })
        ;
    }

}


module.exports = ProductController;
