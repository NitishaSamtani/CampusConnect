const Comment = require("./comment.model");

const Experience = require(
  "../experiences/experience.model"
);

const {
  createComment,
  getComments,
} = require("./comment.service");

const notificationService =
  require("../notifications/notification.service");

const {
  getIO,
} = require("../../sockets/socketServer");

/*
========================================
ADD COMMENT
========================================
*/

const addComment = async (req, res) => {
  try {

    const {
      experienceId,
      message,
    } = req.body;

    const userId =
      req.user.userId;


    /*
    ========================================
    Validate input
    ========================================
    */

    if (!experienceId || !message?.trim()) {

      return res.status(400).json({
        success: false,
        message:
          "Experience ID and message are required.",
      });

    }


    /*
    ========================================
    Find Experience
    ========================================
    */

    const experience =
      await Experience.findById(
        experienceId
      );

    if (!experience) {

      return res.status(404).json({
        success: false,
        message:
          "Experience not found.",
      });

    }


    /*
    ========================================
    Create Comment
    ========================================
    */

    const comment =
      await createComment({
        experienceId,
        userId,
        message: message.trim(),
      });


    /*
    ========================================
    Get Commenter's Name
    ========================================
    */

    const User =
      require("../users/user.model");

    const sender =
      await User.findById(userId)
        .select("name");


    /*
    ========================================
    EXPERIENCE OWNER
    ========================================
    */

    const experienceOwnerId =
      experience.user.toString();


    /*
    ========================================
    Don't notify user about own comment
    ========================================
    */

    if (
      experienceOwnerId !==
      userId.toString()
    ) {

      /*
      ======================================
      Create Notification
      ======================================
      */

      const notification =
        await notificationService
          .createNotification({

            recipient:
              experience.user,

            sender:
              userId,

            type:
              "COMMENT",

            title:
              "New Comment",

            message:
              `${sender?.name || "Someone"} commented on your interview experience.`,

            relatedId:
              experience._id,

            relatedType:
              "Experience",
          });


      /*
      ======================================
      Send Real-Time Notification
      ======================================
      */

      try {

        const io = getIO();

        if (io) {

          io.to(
            `user-${experienceOwnerId}`
          ).emit(
            "new-notification",
            notification
          );

          console.log(
            `🔔 Notification sent to user-${experienceOwnerId}`
          );

        }

      } catch (socketError) {

        console.error(
          "Notification Socket Error:",
          socketError
        );

      }

    }


    /*
    ========================================
    Response
    ========================================
    */

    return res.status(201).json({
      success: true,
      comment,
    });


  } catch (error) {

    console.error(
      "Add Comment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


/*
========================================
GET COMMENTS
========================================
*/

const fetchComments = async (
  req,
  res
) => {

  try {

    const comments =
      await getComments(
        req.params.experienceId
      );

    return res.status(200).json({
      success: true,
      comments,
    });

  } catch (error) {

    console.error(
      "Fetch Comments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


/*
========================================
DELETE COMMENT
========================================
*/

const deleteComment = async (
  req,
  res
) => {

  try {

    const comment =
      await Comment.findById(
        req.params.commentId
      );

    if (!comment) {

      return res.status(404).json({
        success: false,
        message:
          "Comment not found",
      });

    }


    /*
    ========================================
    Authorization
    ========================================
    */

    if (
      comment.userId.toString() !==
      req.user.userId.toString()
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Not authorized",
      });

    }


    await Comment.findByIdAndDelete(
      req.params.commentId
    );


    return res.status(200).json({
      success: true,
      message:
        "Comment deleted successfully",
    });


  } catch (error) {

    console.error(
      "Delete Comment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};


module.exports = {
  addComment,
  fetchComments,
  deleteComment,
};