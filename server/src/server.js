const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

const {
  initializeSocket,
} = require("./sockets/socketServer");

const PORT = process.env.PORT || 5000;


/*
========================================
CONNECT DATABASE
========================================
*/

connectDB();


/*
========================================
CREATE HTTP SERVER
========================================
*/

const server = http.createServer(app);


/*
========================================
INITIALIZE SOCKET.IO
========================================
*/

initializeSocket(server);


/*
========================================
START SERVER
========================================
*/

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

  console.log(
    `Socket.IO running on port ${PORT}`
  );

});