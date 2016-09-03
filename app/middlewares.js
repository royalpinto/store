var easyResponse = function(req, res, next) {
    res.json = function(data) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    };

    res.status = function(status) {
        res.statusCode = status;
        return res;
    };

    next();
};


module.exports = {
    easyResponse: easyResponse,
};
