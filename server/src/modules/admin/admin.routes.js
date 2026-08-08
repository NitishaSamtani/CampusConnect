const express = require("express");

const router =
  express.Router();

const adminController =
  require("./admin.controller");

const authMiddleware =
  require("../../middleware/auth.middleware");

const adminMiddleware =
  require("../../middleware/admin.middleware");


/*
==================================================
ALL ADMIN ROUTES REQUIRE:

1. LOGIN
2. NOT BLOCKED
3. ADMIN ROLE
==================================================
*/

router.use(
  authMiddleware,
  adminMiddleware
);


/*
==================================================
DASHBOARD
==================================================
*/

router.get(
  "/dashboard",
  adminController.getDashboardStats
);


/*
==================================================
USERS
==================================================
*/

router.get(
  "/users",
  adminController.getUsers
);


/*
==================================================
BLOCK USER
==================================================
*/

router.patch(
  "/users/:userId/block",
  adminController.blockUser
);


/*
==================================================
UNBLOCK USER
==================================================
*/

router.patch(
  "/users/:userId/unblock",
  adminController.unblockUser
);


/*
==================================================
DELETE USER
==================================================
*/

router.delete(
  "/users/:userId",
  adminController.deleteUser
);


module.exports = router;