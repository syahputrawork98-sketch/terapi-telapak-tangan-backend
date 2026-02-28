class ApiError extends Error {
  constructor(status, message, errorCode, details = {}) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
  }
}

module.exports = ApiError;
