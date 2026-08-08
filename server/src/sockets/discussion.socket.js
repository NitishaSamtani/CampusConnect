const discussionService = require(
  "../modules/discussions/discussion.service"
);

const User = require(
  "../modules/users/user.model"
);


module.exports = (io, socket) => {

  console.log(
    "💬 Discussion Socket Loaded:",
    socket.id
  );


  /*
  ========================================
  TRACK ROOMS JOINED BY THIS SOCKET
  ========================================
  */

  const joinedRooms =
    new Set();


  /*
  ========================================
  BROADCAST ONLINE MEMBERS
  ========================================
  */

  const broadcastOnlineMembers =
    async (roomId) => {

      try {

        const room =
          await discussionService.getRoomById(
            roomId
          );

        if (!room) {
          return;
        }


        const onlineMembers =
          room.onlineUsers.map(
            (user) => ({
              _id: user._id,
              name: user.name,
            })
          );


        io.to(roomId).emit(
          "user-online",
          {
            onlineUsers:
              onlineMembers.length,

            onlineMembers,
          }
        );


        console.log(
          `👥 ${room.roomName}: ${onlineMembers.length} online`
        );

      } catch (error) {

        console.error(
          "❌ Broadcast Online Members Error:",
          error
        );

      }
    };


  /*
  ========================================
  JOIN ROOM
  ========================================
  */

  socket.on(
    "join-room",
    async ({ roomId }) => {

      try {

        if (!roomId) {
          return;
        }


        if (
          !socket.user ||
          !socket.user.userId
        ) {
          console.log(
            "❌ User not authenticated"
          );

          return;
        }


        const userId =
          socket.user.userId;


        /*
        ------------------------------------
        Check room
        ------------------------------------
        */

        const room =
          await discussionService.getRoomById(
            roomId
          );


        if (!room) {

          console.log(
            "❌ Room not found:",
            roomId
          );

          return;
        }


        /*
        ------------------------------------
        Join Socket.IO room
        ------------------------------------
        */

        socket.join(roomId);

        joinedRooms.add(roomId);


        /*
        ------------------------------------
        Add participant
        ------------------------------------
        */

        await discussionService.joinRoom(
          roomId,
          userId
        );


        /*
        ------------------------------------
        Mark online
        ------------------------------------
        */

        await discussionService.userOnline(
          roomId,
          userId
        );


        /*
        ------------------------------------
        Send online members
        ------------------------------------
        */

        await broadcastOnlineMembers(
          roomId
        );


        console.log(
          `✅ User ${userId} joined ${roomId}`
        );

      } catch (error) {

        console.error(
          "❌ Join Room Error:",
          error
        );

      }

    }
  );


  /*
  ========================================
  TYPING
  ========================================
  */

  socket.on(
    "typing",
    async ({ roomId }) => {

      try {

        if (!roomId) {
          return;
        }


        const userId =
          socket.user?.userId;


        if (!userId) {
          return;
        }


        const user =
          await User.findById(
            userId
          ).select("name");


        socket.to(roomId).emit(
          "typing",
          {
            userId,
            userName:
              user?.name ||
              "Student",
          }
        );

      } catch (error) {

        console.error(
          "❌ Typing Error:",
          error
        );

      }

    }
  );


  /*
  ========================================
  STOP TYPING
  ========================================
  */

  socket.on(
    "stop-typing",
    ({ roomId }) => {

      if (!roomId) {
        return;
      }


      socket.to(roomId).emit(
        "stop-typing"
      );

    }
  );


  /*
  ========================================
  SEND MESSAGE
  ========================================
  */

  socket.on(
    "send-message",
    async ({
      roomId,
      message,
    }) => {

      try {

        if (!roomId) {

          socket.emit(
            "message-error",
            {
              message:
                "Room ID is required.",
            }
          );

          return;
        }


        if (
          !message ||
          !message.trim()
        ) {

          socket.emit(
            "message-error",
            {
              message:
                "Message cannot be empty.",
            }
          );

          return;
        }


        if (
          !socket.user ||
          !socket.user.userId
        ) {

          socket.emit(
            "message-error",
            {
              message:
                "Authentication required.",
            }
          );

          return;
        }


        const userId =
          socket.user.userId;


        /*
        ------------------------------------
        Check room
        ------------------------------------
        */

        const room =
          await discussionService.getRoomById(
            roomId
          );


        if (!room) {

          socket.emit(
            "message-error",
            {
              message:
                "Discussion room not found.",
            }
          );

          return;
        }


        /*
        ------------------------------------
        Get user
        ------------------------------------
        */

        const user =
          await User.findById(
            userId
          ).select("name");


        if (!user) {

          socket.emit(
            "message-error",
            {
              message:
                "User not found.",
            }
          );

          return;
        }


        /*
        ------------------------------------
        Save message
        ------------------------------------
        */

        const savedMessage =
          await discussionService.saveMessage({

            roomId,

            sender:
              userId,

            senderName:
              user.name ||
              "Student",

            message:
              message.trim(),

          });


        /*
        ------------------------------------
        Broadcast
        ------------------------------------
        */

        io.to(roomId).emit(
          "receive-message",
          savedMessage
        );


        console.log(
          `📩 ${user.name}: ${message}`
        );

      } catch (error) {

        console.error(
          "❌ Send Message Error:",
          error
        );


        socket.emit(
          "message-error",
          {
            message:
              "Unable to send message.",
          }
        );

      }

    }
  );


  /*
  ========================================
  LEAVE ROOM
  ========================================
  */

  socket.on(
    "leave-room",
    async ({ roomId }) => {

      try {

        if (!roomId) {
          return;
        }


        const userId =
          socket.user?.userId;


        if (!userId) {
          return;
        }


        /*
        ------------------------------------
        Leave Socket.IO room
        ------------------------------------
        */

        socket.leave(roomId);

        joinedRooms.delete(roomId);


        /*
        ------------------------------------
        Mark offline
        ------------------------------------
        */

        await discussionService.userOffline(
          roomId,
          userId
        );


        /*
        ------------------------------------
        Broadcast updated online members
        ------------------------------------
        */

        await broadcastOnlineMembers(
          roomId
        );


        console.log(
          `🔴 User ${userId} left ${roomId}`
        );

      } catch (error) {

        console.error(
          "❌ Leave Room Error:",
          error
        );

      }

    }
  );


  /*
  ========================================
  DISCONNECT
  ========================================
  */

  socket.on(
    "disconnect",
    async (reason) => {

      console.log(
        `🔌 Socket disconnected: ${socket.id}`
      );

      console.log(
        "Reason:",
        reason
      );


      try {

        const userId =
          socket.user?.userId;


        if (!userId) {
          return;
        }


        /*
        ------------------------------------
        Mark offline in every room
        ------------------------------------
        */

        for (
          const roomId of joinedRooms
        ) {

          await discussionService.userOffline(
            roomId,
            userId
          );


          await broadcastOnlineMembers(
            roomId
          );

        }


        joinedRooms.clear();

      } catch (error) {

        console.error(
          "❌ Disconnect Cleanup Error:",
          error
        );

      }

    }
  );

};