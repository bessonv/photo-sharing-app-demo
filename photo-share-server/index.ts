import * as express from "express";
import * as http from "http";
import * as io from "socket.io";
import cors from "cors";
import { connect } from "./db/db";
import { configurateUserSocket } from "./src/sockets/user.socket";
import { configurateImageSocket } from "./src/sockets/image.socket";

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

  configurateUserSocket(socket, database);
  configurateImageSocket(socket, database);

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
