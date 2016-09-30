const urls = require('./../app/router');
const router = new urls.Router();
const middlewares = require('./middlewares');


const auth = require('./auth');
const users = require('./user');
const products = require('./product');
const cartitem = require('./cartitem');


router.use(middlewares.easyResponse);
router.use(middlewares.querystringParser);
router.use(middlewares.paginate(10, 50));
router.use(middlewares.orderParser);
router.use(middlewares.searchParser);
router.use(middlewares.filter);


router.use(auth);
router.use(users);
router.use(products);
router.use(cartitem);

// Finally if non of the routes have matched or responded.
router.use((req, res) => {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
});


module.exports = router;
