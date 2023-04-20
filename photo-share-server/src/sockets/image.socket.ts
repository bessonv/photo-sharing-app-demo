import { Socket } from "socket.io";
import { EmitEvent, ReciveEvent } from "../../enums";
import { ImageController } from "../controllers/image.controller";
import { Database } from "sqlite3";


export function configurateImageSocket(socket: Socket, database: Database) {
  const imageController = new ImageController(database);
  
  socket.on(ReciveEvent.uploadPhoto, async (data) => {
    try {
      await imageController.addImage(data.photoURL, data.user_id);
      socket.emit(EmitEvent.uploadPhotoMessage, "Upload Successful!");
    } catch(error) {
      console.error(error);
      socket.emit("uploadError", error);
    }
  });

  socket.on(ReciveEvent.allPhotos, async (data) => {
    try {
      const images = await imageController.getAllImages();
      socket.emit(EmitEvent.allPhotosMessage, {
        message: "Photos retrieved successfully",
        photos: images,
      });
    } catch(error) {
      
      console.error(error);
      socket.emit("error", error);
    }
  });

  socket.on(ReciveEvent.sharePhoto, async (name) => {
    try {
      const images = await imageController.getImagesByUserName(name);
      socket.emit(EmitEvent.sharePhotoMessage, images);
    } catch(error) {
      console.error(error);
      socket.emit("error", error);
    }
  });

  socket.on(ReciveEvent.getMyPhotos, async (user_id) => {
    try {
      const images = await imageController.getImagesByUserId(user_id);
      socket.emit(EmitEvent.getMyPhotosMessage, {
        data: images
      });
    } catch(error) {
      console.error(error);
      socket.emit("error", error);
    }
  });

  socket.on(ReciveEvent.photoUpvote, async (data) => {
    try {
      const image = await imageController.upvoteImage(data.user_id, data.image_id);
      const allImages = await imageController.getAllImages();
      socket.emit(EmitEvent.upvoteSuccess, {
        message: "Upvote successful",
        image
      });
      socket.emit(EmitEvent.allPhotosMessage, {
        message: "Photos retrieved successfully",
        photos: allImages
      });
    } catch(error) {
      console.error(error);
      return socket.emit(EmitEvent.upvoteError, {
        error_message: error,
      });
    }
  });
}
