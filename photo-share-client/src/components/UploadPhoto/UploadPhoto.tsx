import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UploadPhotoProps from "./UploadPhoto.props";

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
    socket.on("uploadPhotoMessage", (data) => {
      toast.success(data);
      navigate("/photos");
    });

    return () => {
      socket.off("uploadPhotoMessage");
    }
  }, [socket, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log(photoURL);
      const id = localStorage.getItem("_id");
      const email = localStorage.getItem("_myEmail");

      socket.emit("uploadPhoto", { id, email, photoURL });
  };

  return (
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
  );
};

export default UploadPhoto;
