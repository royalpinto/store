var urls = require('./../app/router');
var router = new urls.Router();
var middlewares = require('./middlewares');
var Controller = require('./../controllers/user');
var controller = new Controller();
var errors = require('./../errors');


router.get(/^\/api\/login\/$/, middlewares.auth());
router.get(/^\/api\/logout\/$/, middlewares.auth());


router.post(/^\/api\/login\/$/, function(req, res) {
    if (req.session.user) {
        return res.json(req.session.user);
    }

    controller
    .login(req.body.username, req.body.password)
    .then(function(user) {
        req.session.user = user.toJSON();
        res.json(user);
    })
    .catch(errors.handler(req, res))
    ;
});

router.get(/^\/api\/login\/$/, function(req, res) {
    res.json(req.session.user);
});

router.post(/^\/api\/register\/$/, function(req, res) {
    controller.create(req.body)
    .then(function(user) {
        req.session.user = user.toJSON();
        res.setHeader('Location', '/api/login/');
        res.status(201).json(user);
    })
    .catch(errors.handler(req, res))
    ;
});

router.get(/^\/api\/logout\/$/, function(req, res) {
    req.session.destroy(function(error) {
        if (error) {
            errors.handler(req, res)(error);
        } else {
            res.status(204).end();
        }
    });
});


module.exports = router;
