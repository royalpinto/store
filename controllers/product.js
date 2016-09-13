var util = require('util');
var models = require('./../models');
var Controller = require('./controller');


var ProductController = function() {
    Controller.call(this, models.Product);
};

util.inherits(ProductController, Controller);


module.exports = new ProductController();
