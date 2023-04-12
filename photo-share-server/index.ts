import * as express from "express";
import * as http from "http";
import * as io from "socket.io";
import cors from "cors";
import { EmitEvent, ReciveEvent } from "./enums";
import { connect } from "./db/db";
import { UserController } from "./controllers/user.controller";
import { ImageController } from "./controllers/image.controller";

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
  const userController = new UserController(database);
  const imageController = new ImageController(database);

  socket.on(ReciveEvent.login, async (data) => {
    console.log(data);
    const { username, password } = data;

    const user = await userController.getUser(username, password);

    if (!user) {
      return socket.emit("loginError", "Incorrect credentials");
    }

    socket.emit(EmitEvent.loginSuccess, {
      message: "Login successfully",
      data: {
        _id: user.user_id,
        _email: user.email,
      },
    });
  });

  socket.on(ReciveEvent.register, async (data) => {
    console.log(data);
    const { username, email, password } = data;

    const user = await userController.addUser(email, username, password);

    if (!user) {
      return socket.emit(EmitEvent.registerError, "User already exists");
    }

    return socket.emit(EmitEvent.registerSuccess, "Account created successfully!");
  });

  socket.on(ReciveEvent.uploadPhoto, async (data) => {
    const { id, email, photoURL } = data;

    const image = await imageController.addImage(photoURL, id);

    if (!image) return;

    socket.emit(EmitEvent.uploadPhotoMessage, "Upload Successful!");
  });

  socket.on(ReciveEvent.allPhotos, async (data) => {
    const images = await imageController.getAllImages();

    socket.emit(EmitEvent.allPhotosMessage, {
      message: "Photos retrieved successfully",
      photos: images,
    });
  });

  socket.on(ReciveEvent.sharePhoto, async (name) => {
    const user = await userController.getUserByName(name);
    let images: Image[] = [];
    if (user?.user_id) {
      images = await imageController.getImagesByUserId(user.user_id);
    }
    socket.emit(EmitEvent.sharePhotoMessage, images);
  });

  socket.on(ReciveEvent.getMyPhotos, async (id) => {
    const images = await imageController.getImagesByUserId(id);
    const user =  await userController.getUserById(id);

    socket.emit(EmitEvent.getMyPhotosMessage, {
      data: images,
      username: user?.username
    });
  });

  socket.on(ReciveEvent.photoUpvote, async (data) => {
    const { user_id, image_id } = data;

    // const user = await userController.getUserById(userID);
    const image = await imageController.getById(image_id);
    console.log(data, image);
    if (!image) {
      return socket.emit(EmitEvent.upvoteError, {
        error_message: "Photo does not exist",
      });
    }

    if (image.user_id == user_id) {
      return socket.emit(EmitEvent.upvoteError, {
        error_message: "You cannot upvote your photos",
      });
    }

    const count = await imageController.increaseCount(user_id, image_id);
    if (count === null) {
      return socket.emit(EmitEvent.upvoteError, {
        error_message: "Duplicate votes are not allowed",
      });
    }

    const images = await imageController.getAllImages();

    socket.emit(EmitEvent.allPhotosMessage, {
      message: "Photos retrieved successfully",
      photos: images,
    });

    return socket.emit(EmitEvent.upvoteSuccess, {
      message: "Upvote successful",
      image,
    });
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
