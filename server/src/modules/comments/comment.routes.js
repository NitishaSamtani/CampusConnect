const express = require("express");

const {
  addComment,
  fetchComments,
  deleteComment,
} = require("./comment.controller");

const verifyToken = require(
  "../../middleware/auth.middleware"
);

const router = express.Router();

router.post(
  "/",
  verifyToken,
  addComment
);

router.delete(
  "/:commentId",
  verifyToken,
  deleteComment
);

router.get(
  "/:experienceId",
  fetchComments
);

module.exports = router;