import React, { useEffect } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";
import { toast } from "react-toastify";
import PhotoContainerProps from "./PhotoContainer.props";

function PhotoContainer({ photos, socket }: PhotoContainerProps) {
  const handleUpvote = (id: string) => {
    console.log("Upvote", id);
    socket.emit("photoUpvote", {
      userID: localStorage.getItem("_id"),
      photoID: id,
    });
  };

  useEffect(() => {
    socket.on("upvoteSuccess", (data) => {
      toast.success(data.message);
      console.log(data.item[0]._ref);
    });
    socket.on("upvoteError", (data) => {
      toast.error(data.error_message);
      console.log('can not upload')
    });
  }, []);

  return (
    <main className='photoContainer'>
      {photos.map((photo) => (
        <div className='photo' key={photo.id}>
          <div className='imageContainer'>
            <img
              src={photo.image_url}
              alt={photo.id}
              className='photo__image'
            />
          </div>

        <button className='upvoteIcon' onClick={() => handleUpvote(photo.id)}>
          <MdOutlineArrowUpward
            style={{ fontSize: "20px", marginBottom: "5px" }}
          />
          <p style={{ fontSize: "12px", color: "#ce7777" }}>
            {photo.vote_count}
          </p>
        </button>
        </div>
      ))}
    </main>
  );
};

export default PhotoContainer;
