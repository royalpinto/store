var urls = require('./../app/router');
var router = new urls.Router();
var controller = require('../controllers/user');




router.get(/^\/users\/(\w+)\/$/, function(req, res) {
    var id = req.params[0];
    controller.getById(id)
    .then(function(user) {
        res.json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

router.get(/^\/users\//, function(req, res) {
    var query = {name: req.query.search};
    controller
    .get(query, req.query.limit, req.query.skip, req.query.order)
    .then(function(user) {
        res.json(user);
    })
    .catch(function(error) {
        errors.handle(req, res, error);
    })
    ;
});

});


module.exports = router;
