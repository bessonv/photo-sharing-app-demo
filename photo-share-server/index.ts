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

const generateID = () => Math.random().toString(36).substring(2, 10);
// const database: User[] = [
//   {
//     id: 'R3_552s7Q0m-8Dr4AAAJ',
//     username: 'user',
//     password: 'dffddf',
//     email: 'user@email.com',
//     images: [
//       {
//         id: 'skn71l8m',
//         image_url: 'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1652341068/EducationHub/photos/ocean-waves.jpg',
//         vote_count: 0,
//         votedUsers: [],
//         _ref: 'user@email.com',
//       },
//       {
//         id: 'hgiu2m1e',
//         image_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZvcmVzdHxlbnwwfHwwfHw%3D&w=1000&q=80',
//         vote_count: 0,
//         votedUsers: [],
//         _ref: 'user@email.com',
//       },
//       {
//         id: 'v3va0z08',
//         image_url: 'https://media.istockphoto.com/id/1288385045/photo/snowcapped-k2-peak.jpg?s=612x612&w=0&k=20&c=sfA4jU8kXKZZqQiy0pHlQ4CeDR0DxCxXhtuTDEW81oo=',
//         vote_count: 0,
//         votedUsers: [],
//         _ref: 'user@email.com',
//       },
//     ],
//   },
//   {
//     id: 'R2_552s7Q0m-8Dr4AAAA',
//     username: 'user2',
//     password: 'dffddf',
//     email: 'user2@email.com',
//     images: []
//   },
// ];

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
        _id: user.id,
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
    if (user?.id) {
      images = await imageController.getImagesByUserId(user.id);
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
    const { userID, photoID } = data;
    let images: Image[] = [];

    const user = await userController.getUserById(userID);

    if (user?.id == photoID) {
      return socket.emit(EmitEvent.upvoteError, {
        error_message: "You cannot upvote your photos",
      });
    }

    // TODO: check if already upvoted

    const image = await imageController.getById(photoID);
    if (!image) return;

    await imageController.increaseCount(photoID);
    images = await imageController.getAllImages();

    socket.emit(EmitEvent.allPhotosMessage, {
      message: "Photos retrieved successfully",
      photos: images,
    });

    return socket.emit(EmitEvent.upvoteSuccess, {
      message: "Upvote successful",
      image,
    });

    socket.emit(EmitEvent.upvoteError, {
      error_message: "Duplicate votes are not allowed",
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
