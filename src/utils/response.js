function successResponse(res, message, data, status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, status, message, errorCode, details = {}) {
  return res.status(status).json({
    success: false,
    message,
    error_code: errorCode,
    details,
  });
}

module.exports = {
  successResponse,
  errorResponse,
};
