var urls = require('./../app/router');
var router = new urls.Router();


var auth = require('./auth');
var users = require('./user');
var products = require('./product');
var cartitem = require('./cartitem');


router.use(auth);
router.use(users);
router.use(products);
router.use(cartitem);

// Finally if non of the routes have matched or responded.
router.use(function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
});


module.exports = router;
