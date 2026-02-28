const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "replace-this-with-strong-secret";
const TOKEN_EXPIRES_SECONDS = Number(process.env.TOKEN_EXPIRES_SECONDS || 86400);

module.exports = {
  PORT,
  JWT_SECRET,
  TOKEN_EXPIRES_SECONDS,
};
