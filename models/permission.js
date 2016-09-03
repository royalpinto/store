var util = require('util');
var Model = require('./model');

var schema = {
    group: {
        type: String,
        required: true,
    },
    noun: {
        type: String,
        required: true,
    },
    verb: {
        type: String,
        required: true,
    },
};

var Permission = function Permission(properties) {
    Model.call(this, properties);
};


util.inherits(Permission, Model);
Object.assign(Permission, Model);

Permission.setSchema(schema);


module.exports = Permission;
