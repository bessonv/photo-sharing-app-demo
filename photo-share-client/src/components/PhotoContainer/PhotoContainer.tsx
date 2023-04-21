import { useEffect } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";
import { toast } from "react-toastify";
import PhotoContainerProps from "./PhotoContainer.props";
import { EmitEvent, ReciveEvent } from "../../enums";
import { getAuthentificationId } from "../../helpers/authenticateUser";

function PhotoContainer({ photos, socket }: PhotoContainerProps) {
  const handleUpvote = (id: number) => {
    console.log("Upvote", id);
    const storageId = getAuthentificationId();
    if (storageId) {
      socket.emit(EmitEvent.photoUpvote, {
        user_id: storageId,
        image_id: id,
      });
    }
  };

  useEffect(() => {
    socket.on(ReciveEvent.upvoteSuccess, (data) => {
      toast.success(data.message);
      console.log(data.item);
    });
    socket.on(ReciveEvent.upvoteError, (data) => {
      toast.error(data.error_message);
      console.log('can not upvote')
    });

    return () => {
      socket.off(ReciveEvent.upvoteSuccess);
      socket.off(ReciveEvent.upvoteError);
    };
  }, []);

  return (
    <main className='photoContainer'>
      {photos.map((photo) => (
        <div className='photo' key={photo.image_id}>
          <div className='imageContainer'>
            <img
              src={photo.image_url}
              alt={`${photo.image_id}`}
              className='photo__image'
            />
          </div>

        <button className='upvoteIcon' onClick={() => handleUpvote(photo.image_id)}>
          <MdOutlineArrowUpward
            style={{ fontSize: "20px", marginBottom: "5px" }}
          />
          <p style={{ fontSize: "12px", color: "#ce7777" }}>
            {photo.vote_count === null ? 0 : photo.vote_count}
          </p>
        </button>
        </div>
      ))}
    </main>
  );
};

export default PhotoContainer;
