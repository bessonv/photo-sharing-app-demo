import { useEffect } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";
import { toast } from "react-toastify";
import PhotoContainerProps from "./PhotoContainer.props";
import { EmitEvent, ReciveEvent } from "../../enums";

function PhotoContainer({ photos, socket }: PhotoContainerProps) {
  const handleUpvote = (id: string) => {
    console.log("Upvote", id);
    socket.emit(EmitEvent.photoUpvote, {
      userID: localStorage.getItem("_id"),
      photoID: id,
    });
  };

  useEffect(() => {
    socket.on(ReciveEvent.upvoteSuccess, (data) => {
      toast.success(data.message);
      console.log(data.item[0]._ref);
    });
    socket.on(ReciveEvent.upvoteError, (data) => {
      toast.error(data.error_message);
      console.log('can not upload')
    });

    return () => {
      socket.off(ReciveEvent.upvoteSuccess);
      socket.off(ReciveEvent.upvoteError);
    };
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
