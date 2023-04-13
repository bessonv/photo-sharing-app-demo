import { Database } from "sqlite3";
import { ImageModel } from "../models/image.model";
import { UserModel } from "../models/user.model";
import { VoteModel } from "../models/vote.mode";

export class ImageController {
  private model: ImageModel;
  private userModel: UserModel;
  private voteModel: VoteModel;

  constructor(db: Database) {
    this.model = new ImageModel(db);
    this.userModel = new UserModel(db)
    this.voteModel = new VoteModel(db);
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

  async increaseCount(userId: number, imageId: number) {
    const exists = await this.voteModel.isVoteExists(userId, imageId);
    console.log(`is Exists: ${exists}`);
    if (exists) {
      const vote = await this.voteModel.getVote(userId, imageId);
      if (vote.value == 1) {
        return null; // or throw exception
      }
      if (vote.value == -1) {
        return await this.voteModel.update(userId, imageId, 0);
      }
      if (vote.value == 0) {
        return await this.voteModel.update(userId, imageId, 1);
      }
    }
    return await this.voteModel.create(userId, imageId, 1);
  }

  async descreaseCount(userId: number, imageId: number) {
    const exists = await this.voteModel.isVoteExists(userId, imageId);
    if (exists) {
      const vote = await this.voteModel.getVote(userId, imageId);
      if (vote.value == -1) {
        return null; // or throw exception
      }
      if (vote.value == 1) {
        return await this.voteModel.update(userId, imageId, 0);
      }
      if (vote.value == 0) {
        return await this.voteModel.update(userId, imageId, -1);
      }
    }
    return await this.voteModel.create(userId, imageId, -1);
  }

  async addImage(image_url: string, user_id: number) {
    // const user = await this.userModel.findById(user_id);
    return await this.model.create(image_url, user_id);
  }
}
