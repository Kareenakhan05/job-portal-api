// Centralized Response Handler
const send_response = (res, status, message, data = null) => {
    return res.status(status).json({
        success: status >= 200 && status < 300, // true for 2xx status codes
        message,
        data,
    });
};

module.exports = {
    send_response
};
