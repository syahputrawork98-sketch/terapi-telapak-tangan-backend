const { randomUUID } = require("crypto");
const ROLES = require("../constants/roles");

const users = [];

function createUser({ name, email, passwordHash, role = ROLES.USER }) {
  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    name,
    email,
    password_hash: passwordHash,
    role,
    created_at: now,
  };
  users.push(user);
  return user;
}

function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

function findUserById(id) {
  return users.find((user) => user.id === id) || null;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
