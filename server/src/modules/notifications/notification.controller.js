const notificationService = require("./notification.service");

/*
========================================
GET ALL NOTIFICATIONS
========================================
*/

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications =
      await notificationService.getUserNotifications(userId);

    const unreadCount =
      await notificationService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });

  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch notifications.",
    });
  }
};


/*
========================================
GET UNREAD COUNT
========================================
*/

const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount =
      await notificationService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      unreadCount,
    });

  } catch (error) {
    console.error(
      "Get Unread Count Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch unread count.",
    });
  }
};


/*
========================================
MARK ONE NOTIFICATION AS READ
========================================
*/

const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notification =
      await notificationService.markAsRead(
        req.params.id,
        userId
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });

  } catch (error) {
    console.error(
      "Mark Notification Read Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update notification.",
    });
  }
};


/*
========================================
MARK ALL NOTIFICATIONS AS READ
========================================
*/

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await notificationService.markAllAsRead(
      userId
    );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read.",
    });

  } catch (error) {
    console.error(
      "Mark All Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update notifications.",
    });
  }
};


/*
========================================
EXPORT
========================================
*/

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};