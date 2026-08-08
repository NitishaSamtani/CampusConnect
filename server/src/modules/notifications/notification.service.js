const Notification = require(
  "./notification.model"
);

/*
========================================
Create Notification
========================================
*/

const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
}) => {

  const notification =
    await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      relatedId,
      relatedType,
    });

  return notification;
};


/*
========================================
Get User Notifications
========================================
*/

const getUserNotifications = async (
  userId
) => {

  return await Notification.find({
    recipient: userId,
  })
    .sort({
      createdAt: -1,
    })
    .limit(50)
    .populate(
      "sender",
      "name"
    );
};


/*
========================================
Get Unread Count
========================================
*/

const getUnreadCount = async (
  userId
) => {

  return await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
};


/*
========================================
Mark Notification Read
========================================
*/

const markAsRead = async (
  notificationId,
  userId
) => {

  return await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );
};


/*
========================================
Mark All Read
========================================
*/

const markAllAsRead = async (
  userId
) => {

  return await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      isRead: true,
    }
  );
};


/*
========================================
Delete Notification
========================================
*/

const deleteNotification = async (
  notificationId,
  userId
) => {

  return await Notification.findOneAndDelete(
    {
      _id: notificationId,
      recipient: userId,
    }
  );
};


module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};