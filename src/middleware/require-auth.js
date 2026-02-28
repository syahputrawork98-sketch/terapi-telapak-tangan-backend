const ApiError = require("../errors/api-error");
const { verifyToken } = require("../utils/token");

function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new ApiError(401, "Unauthorized", "AUTH_UNAUTHORIZED"));
  }

  const payload = verifyToken(token);
  if (!payload || !payload.sub) {
    return next(new ApiError(401, "Unauthorized", "AUTH_UNAUTHORIZED"));
  }

  req.user = {
    id: payload.sub,
    role: payload.role,
    email: payload.email,
  };

  return next();
}

module.exports = {
  requireAuth,
};
