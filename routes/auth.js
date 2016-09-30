'use strict';


const urls = require('./../app/router');
const router = new urls.Router();
const middlewares = require('./middlewares');
const Controller = require('./../controllers/user');
const controller = new Controller();
const errors = require('./../errors');


router.get(/^\/api\/login\/$/, middlewares.auth());
router.get(/^\/api\/logout\/$/, middlewares.auth());


router.post(/^\/api\/login\/$/, (req, res) => {
    if (req.session.user) {
        return res.json(req.session.user);
    }

    controller
    .login(req.body.username, req.body.password)
    .then(user => {
        req.session.user = user.toJSON();
        res.json(user);
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/api\/login\/$/, (req, res) => {
    res.json(req.session.user);
});

router.post(/^\/api\/register\/$/, (req, res) => {
    controller.create(req.body)
    .then(user => {
        req.session.user = user.toJSON();
        res.setHeader('Location', '/api/login/');
        res.status(201).json(user);
    })
    .catch(error => {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/api\/logout\/$/, (req, res) => {
    req.session.destroy(error => {
        if (error) {
            errors.handle(req, res, error);
        } else {
            res.status(204).end();
        }
    });
});


module.exports = router;
