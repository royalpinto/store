var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info',
            filename: 'logs/info.log',
            level: 'info',
        }),
        new (winston.transports.File)({
            name: 'error',
            filename: 'logs/error.log',
            level: 'error',
        }),
        new (winston.transports.Console)({
            colorize: true,
        }),
    ],
});


logger.middleware = function(req, res, next) {
    res.on('finish', function() {
        var username = null;
        if (req.session && req.session.user) {
            username = req.session.user.username;
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
            return logger.info(req.method, req.url, res.statusCode, username);
        }
        if (res.statusCode >= 400 && res.statusCode < 500) {
            return logger.warn(req.method, req.url, res.statusCode, username);
        }
        return logger.error(req.method, req.url, res.statusCode, username);
    });
    next();
};

module.exports = logger;
