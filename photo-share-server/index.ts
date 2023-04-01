import * as express from "express";
import * as http from "http";
import * as io from "socket.io";
import cors from "cors";

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
const database: User[] = [
  {
    id: 'R3_552s7Q0m-8Dr4AAAJ',
    username: 'user',
    password: 'dffddf',
    email: 'user@email.com',
    images: [
      {
        id: 'skn71l8m',
        image_url: 'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1652341068/EducationHub/photos/ocean-waves.jpg',
        vote_count: 0,
        votedUsers: [],
        _ref: 'user@email.com',
      },
      {
        id: 'hgiu2m1e',
        image_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZvcmVzdHxlbnwwfHwwfHw%3D&w=1000&q=80',
        vote_count: 0,
        votedUsers: [],
        _ref: 'user@email.com',
      },
      {
        id: 'v3va0z08',
        image_url: 'https://media.istockphoto.com/id/1288385045/photo/snowcapped-k2-peak.jpg?s=612x612&w=0&k=20&c=sfA4jU8kXKZZqQiy0pHlQ4CeDR0DxCxXhtuTDEW81oo=',
        vote_count: 0,
        votedUsers: [],
        _ref: 'user@email.com',
      },
    ],
  },
  {
    id: 'R2_552s7Q0m-8Dr4AAAA',
    username: 'user2',
    password: 'dffddf',
    email: 'user2@email.com',
    images: []
  },
];

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("login", (data) => {
    console.log(data);
    const { username, password } = data;

    let result = database.filter(
      (user) => user.username === username && user.password === password
    );

    if (result.length !== 1) {
      return socket.emit("loginError", "Incorrect credentials");
    }
    socket.emit("loginSuccess", {
      message: "Login successfully",
      data: {
        _id: result[0].id,
        _email: result[0].email,
      },
    });
  });

  socket.on("register", (data) => {
    console.log(data);
    const { username, email, password } = data;

    let result = database.filter(
      (user) => user.email === email || user.username === username
    );

    if (result.length === 0) {
      database.push({
        id: generateID(),
        username,
        password,
        email,
        images: [],
      });

      return socket.emit("registerSuccess", "Account created successfully!");
    }
    socket.emit("registerError", "User already exists");
  });

  socket.on("uploadPhoto", (data) => {
    const { id, email, photoURL } = data;
    let result = database.filter((user) => user.id === id);

    const newImage: Image = {
      id: generateID(),
      image_url: photoURL,
      vote_count: 0,
      votedUsers: [],
      _ref: email,
    };

    result[0]?.images.unshift(newImage);
    socket.emit("uploadPhotoMessage", "Upload Successful!");
  });

  socket.on("allPhotos", (data) => {
    let images: Image[] = [];

    for (let i = 0; i < database.length; i++) {
      images = images.concat(database[i]?.images);
    }

    socket.emit("allPhotosMessage", {
      message: "Photos retrieved successfully",
      photos: images,
    });
  });

  socket.on("sharePhoto", (name) => {
    let result = database.filter((db) => db.username === name);
    socket.emit("sharePhotoMessage", result[0]?.images);
  });

  socket.on("getMyPhotos", (id) => {
    let result = database.filter((db) => db.id === id);

    socket.emit("getMyPhotosMessage", {
      data: result[0]?.images,
      username: result[0]?.username
    });
  });

  socket.on("photoUpvote", (data) => {
    const { userID, photoID } = data;
    let images: Image[] = [];

    for (let i = 0; i < database.length; i++) {
      if (!(database[i].id === userID)) {
        images = images.concat(database[i]?.images);
      }
    }

    const item = images.filter((image) => image.id === photoID);

    if (item.length < 1) {
      return socket.emit("upvoteError", {
        error_message: "You cannot upvote your photos",
      });
    }

    const voters = item[0]?.votedUsers;
    const authenticateUpvote = voters.filter((voter) => voter === userID);

    if (!authenticateUpvote.length) {
      item[0].vote_count += 1;

      voters.push(userID);
      
      socket.emit("allPhotosMessage", {
				message: "Photos retrieved successfully",
				photos: images,
			});
      return socket.emit("upvoteSuccess", {
        message: "Upvote successful",
        item,
      });
    }

    socket.emit("upvoteError", {
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
