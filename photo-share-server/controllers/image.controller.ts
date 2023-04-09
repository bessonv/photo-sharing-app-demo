import { Database } from "sqlite3";
import { ImageModel } from "../models/image.model";
import { UserModel } from "../models/user.model";

export class ImageController {
  private model: ImageModel;
  private userModel: UserModel;

  constructor(db: Database) {
    this.model = new ImageModel(db);
    this.userModel = new UserModel(db)
  }

  async getById(id: number) {
    const image = await this.model.getImageById(id);
    return image;
  }

  async getImagesByUserId(userId: number) {
    const images = await this.model.getImagesByUserId(userId);
    return images;
  }

  async getAllImages() {
    const images = await this.model.all();
    return images;
  }

  async increaseCount(id: number) {
    const count = await this.model.increaseCount(id);
    return count;
  }

  async descreaseCount(id: number) {
    const count = await this.model.decreaseCount(id);
    return count;
  }

  async addImage(image_url: string, user_id: number) {
    const user = await this.userModel.findById(user_id);
    return this.model.create(image_url, user_id, user.email);
  }
}
