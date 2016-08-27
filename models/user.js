var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


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


UserSchema.plugin(passportLocalMongoose);


// Hide internal password specific fields.
UserSchema.method('toJSON', function() {
    var user = this.toObject();
    delete user.salt;
    delete user.hash;
    delete user.__v;
    return user;
});


module.exports = mongoose.model('User', UserSchema);
