import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
import PhotoContainer from "../PhotoContainer/PhotoContainer";
import { useNavigate } from "react-router-dom";
import SharePhotoProps from "./SharePhoto.props";

function SharePhoto({ socket }: SharePhotoProps) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);

  const { user } = useParams();

  useEffect(() => {
    function authenticateUser() {
      const id = localStorage.getItem("_id");
      if (!id) {
        navigate("/");
      } else {
        socket.emit("sharePhoto", user);
      }
    }
    authenticateUser();
  }, [navigate, socket, user]);

  useEffect(() => {
    socket.on("sharePhotoMessage", (data) => setPhotos(data));

    return () => {
      socket.off("sharePhotoMessage");
    }
  }, [socket]);

  return (
    <div>
      <Nav />
      <PhotoContainer socket={socket} photos={photos} />
    </div>
  );
};

export default SharePhoto;
