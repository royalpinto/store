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


module.exports = router;
