var urls = require('./../app/router');
var router = new urls.Router();


router.get(/^\/users\/\w+\/$/, function(req, res, next) {
    console.log(req.query);
    // console.log('id');
    next();
});

router.get(/^\/users\//, function(req, res, next) {
    // console.log(req.query);
    // console.log('wihtout id');
    next();
});

router.post(/^\/users\//, function(req, res, next) {
    next();
});

router.post(/^\/login\//, function(req, res, next) {

});


module.exports = router;
