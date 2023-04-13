import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UploadPhotoProps from "./UploadPhoto.props";
import Nav from "../Nav/Nav";
import { EmitEvent, ReciveEvent } from "../../enums";

const menu = [
  { name: 'My Photos', path: '/user/photos' }
];

function UploadPhoto({ socket }: UploadPhotoProps) {
  const navigate = useNavigate();
  const [photoURL, setPhotoURL] = useState("");

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
    socket.on(ReciveEvent.uploadPhotoMessage, (data) => {
      toast.success(data);
      navigate("/photos");
    });

    return () => {
      socket.off(ReciveEvent.uploadPhotoMessage);
    }
  }, [socket, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log(photoURL);
      const user_id = localStorage.getItem("_id");
      const email = localStorage.getItem("_myEmail");

      socket.emit(EmitEvent.uploadPhoto, { user_id, email, photoURL });
  };

  return (
    <div>
      <Nav menu={menu} />
      <main className="uploadContainer">
        <div className="uploadText">
          <h2>Upload Image</h2>
          <form method="POST" onSubmit={handleSubmit}>
            <label>Paste the image URL</label>
              <input
                type='text'
                name='fileImage'
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
              <button className='uploadBtn'>UPLOAD</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadPhoto;
