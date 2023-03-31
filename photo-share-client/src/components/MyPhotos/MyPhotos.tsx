
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PhotoContainer from "../PhotoContainer/PhotoContainer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MyPhotosProps from "./MyPhotos.props";

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
    })
  }, [socket]);

  const handleSignOut = () => {
    localStorage.removeItem("_id");
    localStorage.removeItem("_myEmail");
    navigate("/");
  };

  const copyToClipBoard = () => alert(`Copied ✅`);

  return (
    <div>
      <nav className='navbar'>
        <h3>PhotoShare</h3>

        <div className='nav__BtnGroup'>
          <Link to='/photo/upload'>Upload Photo</Link>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

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
