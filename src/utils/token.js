const crypto = require("crypto");
const { JWT_SECRET, TOKEN_EXPIRES_SECONDS } = require("../config/env");

function base64UrlEncode(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

function signHmac(input) {
  return crypto.createHmac("sha256", JWT_SECRET).update(input).digest("base64url");
}

function signToken(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_SECONDS;
  const body = { ...payload, exp };

  const encodedHeader = base64UrlEncode(header);
  const encodedBody = base64UrlEncode(body);
  const unsignedToken = `${encodedHeader}.${encodedBody}`;
  const signature = signHmac(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

function verifyToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedBody, signature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedBody}`;
  const expectedSignature = signHmac(unsignedToken);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedBody, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

module.exports = {
  signToken,
  verifyToken,
};
