const express =
  require("express");

const {
  getDashboard,
} = require(
  "./dashboard.controller"
);

const verifyToken =
  require("../../middleware/auth.middleware");

const router =
  express.Router();

router.get(
  "/",
  verifyToken,
  getDashboard
);

module.exports = router;