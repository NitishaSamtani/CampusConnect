const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const discussionSocket = require("./discussion.socket");
const notificationSocket = require("./notification.socket");

let io = null;


/*
========================================
INITIALIZE SOCKET.IO
========================================
*/

const initializeSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },

    transports: [
      "websocket",
      "polling",
    ],
  });


  /*
  ========================================
  SOCKET AUTHENTICATION
  ========================================
  */

  io.use((socket, next) => {

    try {

      console.log(
        "\n========== SOCKET AUTH =========="
      );


      /*
      ------------------------------------
      Get Cookie Header
      ------------------------------------
      */

      const cookieHeader =
        socket.handshake.headers.cookie || "";


      console.log(
        "🍪 Cookie received:",
        cookieHeader
          ? "YES"
          : "NO"
      );


      if (!cookieHeader) {

        console.log(
          "❌ No cookie received"
        );

        return next(
          new Error("Unauthorized")
        );

      }


      /*
      ------------------------------------
      Find token cookie
      ------------------------------------
      */

      const tokenCookie =
        cookieHeader
          .split(";")
          .find((cookie) => {

            return cookie
              .trim()
              .startsWith("token=");

          });


      if (!tokenCookie) {

        console.log(
          "❌ Token cookie not found"
        );

        return next(
          new Error("Unauthorized")
        );

      }


      /*
      ------------------------------------
      Extract JWT
      ------------------------------------
      */

      const token =
        tokenCookie
          .trim()
          .substring(
            "token=".length
          );


      if (!token) {

        console.log(
          "❌ Token is empty"
        );

        return next(
          new Error("Unauthorized")
        );

      }


      /*
      ------------------------------------
      Verify JWT
      ------------------------------------
      */

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      console.log(
        "✅ JWT verified"
      );

      console.log(
        "👤 User ID:",
        decoded.userId
      );

      console.log(
        "👤 Role:",
        decoded.role
      );


      /*
      ------------------------------------
      Attach authenticated user
      ------------------------------------
      */

      socket.user = {
        userId: decoded.userId,
        role: decoded.role,
      };


      console.log(
        "✅ Socket user attached"
      );


      /*
      ------------------------------------
      Allow connection
      ------------------------------------
      */

      next();

    } catch (error) {

      console.error(
        "❌ Socket Authentication Error:",
        error.message
      );


      next(
        new Error(
          "Authentication Error"
        )
      );

    }

  });


  /*
  ========================================
  SOCKET CONNECTION
  ========================================
  */

  io.on(
    "connection",
    (socket) => {

      console.log(
        "\n================================"
      );

      console.log(
        "🟢 SOCKET CONNECTED"
      );

      console.log(
        "🔌 Socket ID:",
        socket.id
      );

      console.log(
        "👤 User ID:",
        socket.user?.userId
      );

      console.log(
        "================================"
      );


      /*
      ====================================
      DISCUSSION SOCKET
      ====================================
      */

      try {

        discussionSocket(
          io,
          socket
        );

        console.log(
          "💬 Discussion socket initialized"
        );

      } catch (error) {

        console.error(
          "❌ Discussion socket error:",
          error
        );

      }


      /*
      ====================================
      NOTIFICATION SOCKET
      ====================================
      */

      try {

        notificationSocket(
          io,
          socket
        );

        console.log(
          "🔔 Notification socket initialized"
        );

      } catch (error) {

        console.error(
          "❌ Notification socket error:",
          error
        );

      }


      /*
      ====================================
      DISCONNECT
      ====================================
      */

      socket.on(
        "disconnect",
        (reason) => {

          console.log(
            "\n================================"
          );

          console.log(
            "🔴 SOCKET DISCONNECTED"
          );

          console.log(
            "🔌 Socket ID:",
            socket.id
          );

          console.log(
            "👤 User ID:",
            socket.user?.userId
          );

          console.log(
            "Reason:",
            reason
          );

          console.log(
            "================================"
          );

        }
      );

    }
  );


  console.log(
    "🔌 Socket.IO initialized successfully"
  );


  return io;

};


/*
========================================
GET SOCKET.IO INSTANCE
========================================
*/

const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.IO has not been initialized."
    );

  }

  return io;

};


/*
========================================
EXPORTS
========================================
*/

module.exports = {
  initializeSocket,
  getIO,
};