const express = require("express");
const app = express();
const PORT = 4000;

const http = require("http").Server(app);
const cors = require("cors");

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:5173"
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const generateID = () => Math.random().toString(36).substring(2, 10);
const database = [
  {
    id: 'R3_552s7Q0m-8Dr4AAAJ',
    username: 'user',
    password: 'qwerty',
    email: 'user@email.com',
    images: [
      {
        id: generateID(),
        image_url: 'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1652341068/EducationHub/photos/ocean-waves.jpg',
        vote_count: 0,
        votedUsers: [],
        _ref: 'user@email.com',
      },
      {
        id: generateID(),
        image_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZvcmVzdHxlbnwwfHwwfHw%3D&w=1000&q=80',
        vote_count: 0,
        votedUsers: [],
        _ref: 'user@email.com',
      },
      {
        id: generateID(),
        image_url: 'https://media.istockphoto.com/id/1288385045/photo/snowcapped-k2-peak.jpg?s=612x612&w=0&k=20&c=sfA4jU8kXKZZqQiy0pHlQ4CeDR0DxCxXhtuTDEW81oo=',
        vote_count: 0,
        votedUsers: [],
        _ref: 'user@email.com',
      },
    ],
  }
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

    const newImage = {
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
    let images = [];

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

  socket.on('disconnect', () => {
    socket.disconnect();
    console.log('🔥: A user disconnected');
  })
})

app.get("/api", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
