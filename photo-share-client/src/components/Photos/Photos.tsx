import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import PhotoContainer from "../PhotoContainer/PhotoContainer";
import PhotosProps from "./Photos.props";

function Photos({ socket }: PhotosProps) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    function authenticateUser() {
      const id = localStorage.getItem("_id");
      if (!id) {
        navigate("/");
      }
    }
    authenticateUser();
  }, [navigate]);

  useEffect(() => {
    socket.emit("allPhotos", "search");

    socket.on("allPhotosMessage", (data) => {
      // setPhotos([...photos, ...data.photos]);
      setPhotos(data.photos);
    });
  }, [socket]);

  return (
    <div>
      <Nav />
      <PhotoContainer photos={photos} socket={socket} />
    </div>
  );
};

export default Photos;
