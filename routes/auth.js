var urls = require('./../app/router');
var router = new urls.Router();
var controller = require('./../controllers/auth');
var userController = require('./../controllers/user');
var errors = require('./../errors');


router.post(/^\/login\//, function(req, res) {
    if (req.session.user) {
        res.json(req.session.user);
    }

    controller
    .loginUser(req.body.username, req.body.password)
    .then(function(user) {
        req.session.user = user.toJSON();
        res.json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/login\//, function(req, res) {
    userController.readUser(req.session.user._id)
    .then(function(user) {
        req.session.user = user.toJSON();
        res.json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.post(/^\/register\//, function(req, res) {
    controller.registerUser(req.body)
    .then(function(user) {
        req.session.user = user.toObject();
        res.end(JSON.stringify(user));
    })
    .catch(function(error) {
        console.trace(':--', error);
        res.end("Bad Request");
    })
    ;
});


router.get(/^\/logout\//, function(req, res) {
    req.session.destroy(function(err) {
        console.log(err);
        res.end("Hi");
    });
});

module.exports = router;
