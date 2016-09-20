var urls = require('./../app/router');
var router = new urls.Router();
var middlewares = require('./../app/middlewares');


var auth = require('./auth');
var users = require('./user');
var products = require('./product');
var cartitem = require('./cartitem');


router.use(middlewares.easyResponse);
router.use(middlewares.querystringParser);
router.use(middlewares.paginate(10, 50));
router.use(middlewares.orderParser);
router.use(middlewares.searchParser);


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
