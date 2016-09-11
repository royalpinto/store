var urls = require('./../app/router');
var router = new urls.Router();
var routes = require('./index');
var controller = require('./../controllers/auth');
var errors = require('./../errors');


router.get(/^\/login\/$/, routes.handlePermission());
router.get(/^\/logout\/$/, routes.handlePermission());


router.post(/^\/login\/$/, function(req, res) {
    if (req.session.user) {
        return res.json(req.session.user);
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

router.get(/^\/login\/$/, function(req, res) {
    res.json(req.session.user);
});

router.post(/^\/register\/$/, function(req, res) {
    controller.registerUser(req.body)
    .then(function(user) {
        req.session.user = user.toJSON();
        res.setHeader('Location', '/login/');
        res.status(201).json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/logout\/$/, function(req, res) {
    req.session.destroy(function(error) {
        if (error) {
            errors.handle(req, res, error);
        } else {
            res.status(204).end();
        }
    });
});


module.exports = router;
