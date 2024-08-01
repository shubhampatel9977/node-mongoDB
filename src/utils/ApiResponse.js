
function ApiSuccess (res, statusCode, status=true, message = "Success", data) {
    res.status(statusCode).json({
        statusCode: statusCode,
        success: status,
        message: message,
        data: data,
    });
}

function ApiError (res, statusCode, message = "Error", data) {
    res.status(statusCode).json({
        statusCode: statusCode,
        success: statusCode < 400 || false,
        message: message,
        data: data,
    });
}

module.exports = { ApiSuccess, ApiError };