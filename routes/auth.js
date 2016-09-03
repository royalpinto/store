var urls = require('./../app/router');
var router = new urls.Router();
var controller = require('./../controllers/auth');
var userController = require('./../controllers/user');


router.post(/^\/login\//, function(req, res) {
    controller.loginUser(req.body.username, req.body.password)
    .then(function(user) {
        req.session.user = user.toObject();
        res.end(JSON.stringify(user));
    })
    .catch(function(error) {
        console.trace(error);
        res.end("Bad Request");
    })
    ;
});

router.get(/^\/login\//, function(req, res) {
    userController.readUser(req.session.user._id)
    .then(function(user) {
        req.session.user = user.toObject();
        res.end(JSON.stringify(user));
    })
    .catch(function(error) {
        console.trace(error);
        res.end("Bad Request");
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
