var urls = require('./../app/router');
var router = new urls.Router();
var middlewares = require('./middlewares');
var controller = require('./../controllers/auth');
var errors = require('./../errors');


router.get(/^\/api\/login\/$/, middlewares.handlePermission());
router.get(/^\/api\/logout\/$/, middlewares.handlePermission());


router.post(/^\/api\/login\/$/, function(req, res) {
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

router.get(/^\/api\/login\/$/, function(req, res) {
    res.json(req.session.user);
});

router.post(/^\/api\/register\/$/, function(req, res) {
    controller.registerUser(req.body)
    .then(function(user) {
        req.session.user = user.toJSON();
        res.setHeader('Location', '/api/login/');
        res.status(201).json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/api\/logout\/$/, function(req, res) {
    req.session.destroy(function(error) {
        if (error) {
            errors.handle(req, res, error);
        } else {
            res.status(204).end();
        }
    });
});


module.exports = router;
