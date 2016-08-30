var mongoose = require('mongoose');


var ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Product', ProductSchema);
