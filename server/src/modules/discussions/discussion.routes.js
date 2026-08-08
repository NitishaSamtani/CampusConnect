const express = require("express");

const router = express.Router();

const discussionController = require("./discussion.controller");

// Update this path according to your project
const authMiddleware = require("../../middleware/auth.middleware");

/*
========================================
Discussion Rooms
========================================
*/

// Get single room
router.get(
  "/:roomId",
  authMiddleware,
  discussionController.getRoom
);

router.get(
  "/role/:roleId",
  authMiddleware,
  discussionController.getRoomByRole
);

// Get all rooms
router.get(
  "/rooms",
  authMiddleware,
  discussionController.getAllRooms
);



// Create room
router.post(
  "/create-room",
  authMiddleware,
  discussionController.createRoom
);

// Delete room
router.delete(
  "/:roomId",
  authMiddleware,
  discussionController.deleteRoom
);

/*
========================================
Messages
========================================
*/

// Get messages of room
router.get(
  "/:roomId/messages",
  authMiddleware,
  discussionController.getMessages
);

/*
========================================
Participants
========================================
*/

// Join room
router.post(
  "/:roomId/join",
  authMiddleware,
  discussionController.joinRoom
);

// Leave room
router.post(
  "/:roomId/leave",
  authMiddleware,
  discussionController.leaveRoom
);

module.exports = router;