var express = require('express');
var passport = require('passport');
var router = new express.Router();
var roles = require('./../roles');
var User = require('./../models/user');
var Cart = require('./../models/cart');


router.post('/register', function(req, res, next) {
    var user = new User(req.body);
    User.register(user, req.body.password, function(err, user) {
        if (err) {
            return next(err);
        }

        // Initialize user documents and roles.
        Promise.all([
            // Assign user with a default role: member.
            roles.addUserRoles(user.username, ['member']),
            // Create a cart for user.
            // Rather than checking everytime if cart is available
            // while adding a product.
            Cart.create({userId: user._id}),
        ])
        .then(function() {
            passport.authenticate('local')(req, res, function() {
                res.location('/api/login/');
                res.send(201);
            });
        });
    });
});

router.get('/login', function(req, res) {
    res.json(req.user);
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.status(204).send();
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(204).send();
});


module.exports = router;
