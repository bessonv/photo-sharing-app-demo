import * as express from "express";
import * as http from "http";
import * as io from "socket.io";
import cors from "cors";
import { connect } from "./db/db";
import { UserSocket } from "./src/sockets/user.socket";
import { ImageSocket } from "./src/sockets/image.socket";
import { handleErrors } from "./src/helpers/errors";

const app = express.default();
const PORT = 4000;

const server = new http.Server(app);

const socketIO = new io.Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

socketIO.on('connection', async (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  const database = await connect();
  const imageSocket = new ImageSocket(database, socket);
  const userSocket = new UserSocket(database, socket);

  socket.onAny(async (event, data) => {
    try {
      await imageSocket.configurateSocket(event, data);
      await userSocket.configurateSocket(event, data);
    } catch(error) {
      const errorMessage = handleErrors(error);
      if (!errorMessage) return;
      socket.emit(errorMessage.event, { error_message: errorMessage.message });
    }
  });


  socket.on('disconnect', () => {
    socket.disconnect();
    console.log('🔥: A user disconnected');
  });
})

app.get("/api", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
