'use strict';


const urls = require('./../app/router');
const router = new urls.Router();
const middlewares = require('./middlewares');
const Controller = require('../controllers/user');
const controller = new Controller();
const errors = require('./../errors');


// This route can be accessed only logged in users.
router.use(/^\/api\/users\//, middlewares.auth());
router.get(/^\/api\/users\/$/, middlewares.auth('users', 'read'));


router.get(/^\/api\/users\/([a-fA-F\d]{24})\/$/, (req, res) => {
    let id = req.params[0];
    Promise.resolve(id === req.session.user._id)
    .then(permit => {
        return permit ||
            controller.hasPermission(req.session.user._id, 'users', 'read');
    })
    .then(permit => {
        if (!permit) {
            throw new errors.UnauthorizedAccess();
        }
        return controller.getById(id);
    })
    .then(user => {
        res.json(user);
    })
    .catch(errors.handler(req, res))
    ;
});

router.get(/^\/api\/users\/$/, (req, res) => {
    let filter = req.query.filter;
    if (req.query.search) {
        filter.name = req.query.search;
    }
    controller
    .get(filter, req.query.limit, req.query.skip, req.query.order)
    .then(user => {
        res.json(user);
    })
    .catch(errors.handler(req, res))
    ;
});

router.put(/^\/api\/users\/([a-fA-F\d]{24})\/$/, (req, res) => {
    let id = req.params[0];
    Promise.resolve(id === req.session.user._id)
    .then(permit => {
        if (!permit) {
            throw new errors.UnauthorizedAccess();
        }
        return controller.update(id, req.body);
    })
    .then(() => {
        res.status(204).end();
    })
    .catch(errors.handler(req, res))
    ;
});

router.delete(/^\/api\/users\/([a-fA-F\d]{24})\/$/, (req, res) => {
    let id = req.params[0];
    Promise.resolve(id === req.session.user._id)
    .then(permit => {
        return permit ||
            controller.hasPermission(req.session.user._id, 'users', 'write');
    })
    .then(permit => {
        if (!permit) {
            throw new errors.UnauthorizedAccess();
        }
        return controller.remove(id, req.body);
    })
    .then(() => {
        if (id === req.session.user._id) {
            req.session.destroy();
        }
        res.status(204).end();
    })
    .catch(errors.handler(req, res))
    ;
});


module.exports = router;
