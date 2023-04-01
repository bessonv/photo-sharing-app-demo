import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SharePhotoProps from "./SharePhoto.props";
import Nav from "../Nav/Nav";
import PhotoContainer from "../PhotoContainer/PhotoContainer";
import { getAuthentificationId } from "../../helpers/authenticateUser";
import { EmitEvent, ReciveEvent } from "../../enums";

const menu = [
  { name: 'My Photos', path: '/user/photos' },
  { name: 'Upload Photo', path: '/photo/upload' }
];

function SharePhoto({ socket }: SharePhotoProps) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);

  const { user } = useParams();

  useEffect(() => {
    const id = getAuthentificationId();
    if (!id) {
      navigate("/");
    } else {
      socket.emit(EmitEvent.sharePhoto, user);
    }
  }, [navigate, socket, user]);

  useEffect(() => {
    socket.on(ReciveEvent.sharePhotoMessage, (data) => setPhotos(data));

    return () => {
      socket.off(ReciveEvent.sharePhotoMessage);
    }
  }, [socket]);

  return (
    <div>
      <Nav menu={menu}/>
      <PhotoContainer socket={socket} photos={photos} />
    </div>
  );
};

export default SharePhoto;
