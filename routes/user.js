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


});


module.exports = router;
