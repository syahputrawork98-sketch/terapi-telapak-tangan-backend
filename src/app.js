const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const { notFoundHandler, errorHandler } = require("./middleware/error-handler");
const { successResponse } = require("./utils/response");

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  return successResponse(res, "OK", { status: "up" });
});

app.use("/auth", authRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
