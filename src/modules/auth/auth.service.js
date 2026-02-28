const ApiError = require("../../errors/api-error");
const ROLES = require("../../constants/roles");
const { hashPassword, verifyPassword } = require("../../utils/password");
const { signToken } = require("../../utils/token");
const { createUser, findUserByEmail, findUserById } = require("../../store/user-store");

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

function validateRegisterPayload(payload) {
  const details = {};

  if (!payload.name || payload.name.trim().length < 3) {
    details.name = "name must be at least 3 characters";
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    details.email = "email must be valid";
  }

  if (!payload.password || payload.password.length < 8) {
    details.password = "password must be at least 8 characters";
  }

  return details;
}

function validateLoginPayload(payload) {
  const details = {};

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    details.email = "email must be valid";
  }

  if (!payload.password || payload.password.length < 1) {
    details.password = "password is required";
  }

  return details;
}

function register(payload) {
  const details = validateRegisterPayload(payload);
  if (Object.keys(details).length > 0) {
    throw new ApiError(400, "Invalid register payload", "VALIDATION_ERROR", details);
  }

  const existing = findUserByEmail(payload.email);
  if (existing) {
    throw new ApiError(400, "Email already registered", "VALIDATION_ERROR", {
      email: "email already registered",
    });
  }

  const user = createUser({
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    passwordHash: hashPassword(payload.password),
    role: ROLES.USER,
  });

  return sanitizeUser(user);
}

function login(payload) {
  const details = validateLoginPayload(payload);
  if (Object.keys(details).length > 0) {
    throw new ApiError(400, "Invalid login payload", "VALIDATION_ERROR", details);
  }

  const user = findUserByEmail(payload.email);
  if (!user || !verifyPassword(payload.password, user.password_hash)) {
    throw new ApiError(401, "Invalid email or password", "AUTH_UNAUTHORIZED");
  }

  const accessToken = signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  });

  return {
    access_token: accessToken,
    user: sanitizeUser(user),
  };
}

function getMe(userId) {
  const user = findUserById(userId);
  if (!user) {
    throw new ApiError(401, "Unauthorized", "AUTH_UNAUTHORIZED");
  }

  return sanitizeUser(user);
}

module.exports = {
  register,
  login,
  getMe,
};
