var express = require('express');
var passport = require('passport');
var router = new express.Router();
var roles = require('./../roles');
var User = require('./../models/user');
var Cart = require('./../models/cart');


/**
 * @api {post} /api/register/ Register new user
 * @apiName AddUser
 * @apiGroup Auth
 *
 * @apiParam {String} name User name
 * @apiParam {String} email User email
 * @apiParam {String} username Unique user id (this will be a login id)
 * @apiParam {String} password User password
 *
 * @apiSuccess (Success 201) {Header} Location URI of the newly created user.
 */
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

/**
 * @api {get} /api/login/ Get logged in user details
 * @apiName GetUser
 * @apiGroup Auth
 *
 * @apiSuccess (Success 200) {String} name User name
 * @apiSuccess (Success 200) {String} email User email
 * @apiSuccess (Success 200) {String} username User login id
 */
router.get('/login', function(req, res) {
    res.json(req.user);
});

/**
 * @api {post} /api/login/ Login
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {String} username User id
 * @apiParam {String} password password
 *
 * @apiSuccess (Success 204) {String} 204 No Content
 */
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.status(204).send();
});

/**
 * @api {get} /api/logout/ Logout
 * @apiName Logout
 * @apiGroup Auth
 *
 * @apiSuccess (Success 204) {String} 204 No Content
 */
router.get('/logout', function(req, res) {
    req.logout();
    res.status(204).send();
});


module.exports = router;
