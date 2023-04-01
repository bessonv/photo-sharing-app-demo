import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MyPhotosProps from "./MyPhotos.props";
import Nav from "../Nav/Nav";
import PhotoContainer from "../PhotoContainer/PhotoContainer";
import { getAuthentificationId } from "../../helpers/authenticateUser";
import { EmitEvent, ReciveEvent } from "../../enums";

const menu = [
  { name: 'Upload Photo', path: '/photo/upload' }
];

function MyPhotos({ socket }: MyPhotosProps) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [userLink, setUserlink] = useState("");  

  useEffect(() => {
    const id = getAuthentificationId();
    if (id) {
      socket.emit(EmitEvent.getMyPhotos, id);
    } else {
      navigate("/");
    }
  }, [navigate, socket]);

  useEffect(() => {
    socket.on(ReciveEvent.getMyPhotosMessage, (data) => {
      setPhotos(data.data);
      setUserlink(`http://localhost:3000/share/${data.username}`);
    });

    return () => {
      socket.off(ReciveEvent.getMyPhotosMessage);
    }
  }, [socket]);

  const copyToClipBoard = () => alert(`Copied ✅`);

  return (
    <div>
      <Nav menu={menu}/>
      <h2 className="header-name">My Photos</h2>
      <div className='copyDiv'>
        <button className="copyContainer">
          <CopyToClipboard
            text={userLink}
            onCopy={copyToClipBoard}
          >
            <span className='shareLink'>Copy your share link</span>
          </CopyToClipboard>
        </button>
      </div>

      <PhotoContainer socket={socket} photos={photos} />
    </div>
  );
}

export default MyPhotos;
