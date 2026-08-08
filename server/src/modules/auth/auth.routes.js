const express = require("express");

const {
  register,
  login,
  getProfile,
  logout,
  googleLogin,
} = require("./auth.controller");

const verifyToken = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/google",googleLogin);

router.get("/profile", verifyToken, getProfile);

router.post( "/logout", logout);

module.exports = router;