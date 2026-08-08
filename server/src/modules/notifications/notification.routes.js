const express = require("express");

const router = express.Router();

const notificationController =
  require("./notification.controller");

const authMiddleware =
  require("../../middleware/auth.middleware");


/*
========================================
GET ALL NOTIFICATIONS
========================================
*/

router.get(
  "/",
  authMiddleware,
  notificationController.getNotifications
);


/*
========================================
GET UNREAD COUNT
========================================
*/

router.get(
  "/unread",
  authMiddleware,
  notificationController.getUnreadCount
);


/*
========================================
MARK ONE AS READ
========================================
*/

router.patch(
  "/:id/read",
  authMiddleware,
  notificationController.markAsRead
);


/*
========================================
MARK ALL AS READ
========================================
*/

router.patch(
  "/read-all",
  authMiddleware,
  notificationController.markAllAsRead
);


module.exports = router;