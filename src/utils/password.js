const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, originalHash] = passwordHash.split(":");
  if (!salt || !originalHash) {
    return false;
  }

  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hashed, "hex");
  const b = Buffer.from(originalHash, "hex");
  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
