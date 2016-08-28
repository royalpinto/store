var express = require('express');
var passport = require('passport');
var router = new express.Router();
var roles = require('./../roles');
var User = require('./../models/user');


router.post('/register', function(req, res, next) {
    var user = new User(req.body);
    User.register(user, req.body.password, function(err, user) {
        if (err) {
            return next(err);
        }

        // The user will be assinged with a default role: `member`.
        roles.addUserRoles(user.username, ['member']);

        passport.authenticate('local')(req, res, function() {
            res.json(user);
        });
    });
});

router.get('/login', function(req, res) {
    res.json(req.user);
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.json(req.user);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(204).send();
});


module.exports = router;
