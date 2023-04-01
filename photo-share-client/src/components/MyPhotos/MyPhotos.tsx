
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PhotoContainer from "../PhotoContainer/PhotoContainer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MyPhotosProps from "./MyPhotos.props";
import Nav from "../Nav/Nav";

const menu = [
  { name: 'Upload Photo', path: '/photo/upload' }
];

function MyPhotos({ socket }: MyPhotosProps) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [userLink, setUserlink] = useState("");  

  useEffect(() => {
    function authenticateUser() {
      const id = localStorage.getItem("_id");
      if (!id) {
        navigate("/");
      } else {
        socket.emit("getMyPhotos", id);
      }
    }
    authenticateUser();
  }, [navigate, socket]);

  useEffect(() => {
    socket.on("getMyPhotosMessage", (data) => {
      setPhotos(data.data);
      setUserlink(`http://localhost:3000/share/${data.username}`);
    });

    return () => {
      socket.off("getMyPhotosMessage");
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
