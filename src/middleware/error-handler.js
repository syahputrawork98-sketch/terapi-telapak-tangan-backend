const ApiError = require("../errors/api-error");
const { errorResponse } = require("../utils/response");

function notFoundHandler(_req, _res, next) {
  next(new ApiError(404, "Resource not found", "RESOURCE_NOT_FOUND"));
}

function errorHandler(error, _req, res, _next) {
  if (error instanceof ApiError) {
    return errorResponse(res, error.status, error.message, error.errorCode, error.details);
  }

  return errorResponse(res, 500, "Internal server error", "INTERNAL_ERROR", {});
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
