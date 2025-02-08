function responseMiddleware(req, res, next) {
    res.send_response = function (status, message, data = null) {
        return res.status(status).json({ status, message, data });
    };
    next(); // Proceed to the next middleware
}


module.exports = responseMiddleware;
