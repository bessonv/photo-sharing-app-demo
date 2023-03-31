import { BrowserRouter, Routes, Route } from "react-router-dom";
import Photos from "./components/Photos/Photos";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UploadPhoto from "./components/UploadPhoto/UploadPhoto";
import MyPhotos from "./components/MyPhotos/MyPhotos";
import SharePhoto from "./components/SharePhoto/SharePhoto";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { io, connect } from "socket.io-client";

function App() {
  const socket = connect("http://localhost:4000");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login socket={socket} />} />
          <Route path="/register" element={<Register socket={socket} />} />
          <Route path="/photos" element={<Photos socket={socket} />} />
          <Route path="/photo/upload" element={<UploadPhoto socket={socket} />} />
          <Route path="/user/photos" element={<MyPhotos socket={socket} />} />
          <Route path="/share/:user" element={<SharePhoto socket={socket} />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;
