var urls = require('./../app/router');
var router = new urls.Router();
var controller = require('../controllers/product');


router.get(/^\/products\/(\w+)\/$/, function(req, res) {
    var id = req.params[0];
    controller.getById(id)
    .then(function(product) {
        res.json(product);
    })
    .catch(function() {
        res.end("Bad Request");
    })
    ;
});

router.get(/^\/products\//, function(req, res, next) {
    next();
});

router.post(/^\/products\//, function(req, res) {
    controller
    .create(req.body)
    .then(function(product) {
        res.json(product);
    })
    .catch(function(error) {
        console.trace(error);
        res.end("Bad Request");
    })
    ;
});


module.exports = router;
