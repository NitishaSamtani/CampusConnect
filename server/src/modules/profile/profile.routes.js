const express = require("express");

const router = express.Router();

const profileController =
  require("./profile.controller");

const authMiddleware =
  require("../../middleware/auth.middleware");


/*
========================================
PROFILE
========================================
*/


/*
GET PROFILE
GET /api/profile
*/

router.get(
  "/",
  authMiddleware,
  profileController.getProfile
);


/*
UPDATE PROFILE
PUT /api/profile
*/

router.put(
  "/",
  authMiddleware,
  profileController.updateProfile
);


/*
========================================
MY EXPERIENCES
========================================
*/


/*
GET MY EXPERIENCES
GET /api/profile/experiences
*/

router.get(
  "/experiences",
  authMiddleware,
  profileController.getMyExperiences
);


/*
========================================
MY COMMENTS
========================================
*/


/*
GET MY COMMENTS
GET /api/profile/comments
*/

router.get(
  "/comments",
  authMiddleware,
  profileController.getMyComments
);


/*
========================================
MY ACTIVITY
========================================
*/


/*
GET MY ACTIVITY
GET /api/profile/activity
*/

router.get(
  "/activity",
  authMiddleware,
  profileController.getMyActivity
);


module.exports = router;