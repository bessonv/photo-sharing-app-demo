import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import PhotoContainer from "../PhotoContainer/PhotoContainer";
import PhotosProps from "./Photos.props";
import { getAuthentificationId } from "../../helpers/authenticateUser";

const menu = [
  { name: 'My Photos', path: '/user/photos' },
  { name: 'Upload Photo', path: '/photo/upload' }
];

function Photos({ socket }: PhotosProps) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const id = getAuthentificationId();
    if (!id) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    socket.emit("allPhotos", "search");

    socket.on("allPhotosMessage", (data) => {
      setPhotos(data.photos);
    });

    return () => {
      socket.off("allPhotosMessage");
    }
  }, [socket]);

  return (
    <div>
      <Nav menu={menu}/>
      <h2 className="header-name">Photos</h2>
      <PhotoContainer photos={photos} socket={socket} />
    </div>
  );
};

export default Photos;
