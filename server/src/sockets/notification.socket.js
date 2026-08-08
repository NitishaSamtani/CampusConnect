module.exports = (io, socket) => {

  console.log(
    "🔔 Notification Socket Loaded:",
    socket.id
  );


  const userId =
    socket.user?.userId;


  if (!userId) {

    console.log(
      "❌ Notification socket: User not authenticated"
    );

    return;
  }


  console.log(
    `🔔 Notification socket connected for user: ${userId}`
  );


  /*
  ========================================
  PERSONAL NOTIFICATION ROOM
  ========================================
  */

  const notificationRoom =
    `user-${userId}`;


  socket.join(
    notificationRoom
  );


  console.log(
    `🔔 User joined notification room: ${notificationRoom}`
  );


  /*
  ========================================
  OPTIONAL MANUAL JOIN
  ========================================
  */

  socket.on(
    "join-notification-room",
    () => {

      socket.join(
        notificationRoom
      );

      console.log(
        `🔔 Notification room confirmed: ${notificationRoom}`
      );

    }
  );

};