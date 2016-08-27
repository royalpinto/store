var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
});


module.exports = mongoose.model('User', UserSchema);
