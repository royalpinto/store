var mongoose = require('mongoose');
var CartItem = require('./cartitem');


var CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [CartItem.schema],
});


module.exports = mongoose.model('Cart', CartSchema);
