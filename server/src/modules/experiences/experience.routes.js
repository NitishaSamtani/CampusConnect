const express = require("express");

const router =
  express.Router();

const experienceController =
  require("./experience.controller");

const authMiddleware =
  require("../../middleware/auth.middleware");


/*
========================================
CREATE EXPERIENCE
========================================
*/

router.post(
  "/",
  authMiddleware,
  experienceController.createExperience
);


/*
========================================
SEARCH / FILTER
========================================

IMPORTANT:
This must come BEFORE /:id
*/

router.get(
  "/search",
  authMiddleware,
  experienceController.searchExperiences
);


/*
========================================
GET ALL EXPERIENCES
========================================
*/

router.get(
  "/",
  authMiddleware,
  experienceController.getExperiences
);


/*
========================================
GET EXPERIENCE BY ID
========================================
*/

router.get(
  "/:id",
  authMiddleware,
  experienceController.getExperienceById
);


/*
========================================
DELETE EXPERIENCE
========================================
*/

router.delete(
  "/:id",
  authMiddleware,
  experienceController.deleteExperience
);


module.exports = router;