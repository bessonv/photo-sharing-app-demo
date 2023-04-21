import { Socket } from "socket.io";
import { EmitEvent, ReciveEvent } from "../../enums";
import { ImageController } from "../controllers/image.controller";
import { Database } from "sqlite3";

export class ImageSocket implements appSocket {
  database: Database;
  socket: Socket;

  constructor(db: Database, socket: Socket) {
    this.database = db;
    this.socket = socket;
  }

  async configurateSocket(event: string, data: any) {
    const imageController = new ImageController(this.database);

    if(event === ReciveEvent.uploadPhoto) {
      await imageController.addImage(data.photoURL, data.user_id);
      this.socket.emit(EmitEvent.uploadPhotoMessage, "Upload Successful!");
    }
    if(event === ReciveEvent.allPhotos) {
      const images = await imageController.getAllImages();
      this.socket.emit(EmitEvent.allPhotosMessage, {
        message: "Photos retrieved successfully",
        photos: images,
      });
    }
    if(event === ReciveEvent.sharePhoto) {
      const images = await imageController.getImagesByUserName(data);
      this.socket.emit(EmitEvent.sharePhotoMessage, images);
    }
    if(event === ReciveEvent.getMyPhotos) {
      const images = await imageController.getImagesByUserId(data);
      this.socket.emit(EmitEvent.getMyPhotosMessage, {
        data: images
      });
    }
    if(event === ReciveEvent.photoUpvote) {
      const image = await imageController.upvoteImage(data.user_id, data.image_id);
      const allImages = await imageController.getAllImages(); 
      this.socket.emit(EmitEvent.upvoteSuccess, {
        message: "Upvote successful",
        image
      });
      this.socket.emit(EmitEvent.allPhotosMessage, {
        message: "Photos retrieved successfully",
        photos: allImages
      });
    }
  }
}
