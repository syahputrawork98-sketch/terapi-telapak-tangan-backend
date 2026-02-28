const express = require("express");
const { register, login, getMe } = require("./auth.service");
const { successResponse } = require("../../utils/response");
const { requireAuth } = require("../../middleware/require-auth");

const router = express.Router();

router.post("/register", (req, res, next) => {
  try {
    const user = register(req.body || {});
    return successResponse(res, "Register success", user, 201);
  } catch (error) {
    return next(error);
  }
});

router.post("/login", (req, res, next) => {
  try {
    const data = login(req.body || {});
    return successResponse(res, "Login success", data, 200);
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (req, res, next) => {
  try {
    const user = getMe(req.user.id);
    return successResponse(res, "Profile fetched", user, 200);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
