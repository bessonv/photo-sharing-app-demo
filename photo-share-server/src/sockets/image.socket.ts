import { Socket } from "socket.io";
import { EmitEvent, ReciveEvent } from "../../enums";
import { ImageController } from "../controllers/image.controller";
import { Database } from "sqlite3";
import { DatabaseError, NotFoundError, UploadError, UpvoteError, ValidationError } from "../helpers/errors";

export function configurateImageSocket(socket: Socket, database: Database) {
  try {
    const imageController = new ImageController(database);

    socket.on(ReciveEvent.uploadPhoto, async (data) => {
      await imageController.addImage(data.photoURL, data.user_id);
      socket.emit(EmitEvent.uploadPhotoMessage, "Upload Successful!");
    });

    socket.on(ReciveEvent.allPhotos, async (data) => {
      const images = await imageController.getAllImages();
      socket.emit(EmitEvent.allPhotosMessage, {
        message: "Photos retrieved successfully",
        photos: images,
      });
    });

    socket.on(ReciveEvent.sharePhoto, async (name) => {
      const images = await imageController.getImagesByUserName(name);
      socket.emit(EmitEvent.sharePhotoMessage, images);
    });

    socket.on(ReciveEvent.getMyPhotos, async (user_id) => {
      const images = await imageController.getImagesByUserId(user_id);
      socket.emit(EmitEvent.getMyPhotosMessage, {
        data: images
      });
    });

    socket.on(ReciveEvent.photoUpvote, async (data) => {
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
    });
  } catch(error) {
    if (error instanceof UploadError) {
      console.error(error.message);
      return socket.emit(EmitEvent.uploadError, error.message);
    }
    if (error instanceof UpvoteError) {
      console.error(error.message);
      return socket.emit(EmitEvent.upvoteError, {
        error_message: error.message,
      });
    }
    if (error instanceof NotFoundError) {
      console.error(error.message);
      return socket.emit(EmitEvent.notFoundError, {
        error_message: error.message
      });
    }
    if (
      error instanceof DatabaseError ||
      error instanceof ValidationError
    ) {
      console.error(error.message);
      return;
    }
  }
}
