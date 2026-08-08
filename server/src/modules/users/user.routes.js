const express = require("express");

const router = express.Router();

const userController =
  require("./user.controller");

const authMiddleware =
  require("../../middleware/auth.middleware");

router.get(
  "/profile",
  authMiddleware,
  userController.getProfile
);

router.put(
  "/profile",
  authMiddleware,
  userController.updateProfile
);

router.get(
  "/profile/experiences",
  authMiddleware,
  userController.getMyExperiences
);

router.get(
  "/profile/comments",
  authMiddleware,
  userController.getMyComments
);

module.exports = router;