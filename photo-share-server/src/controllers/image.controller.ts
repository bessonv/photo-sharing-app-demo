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
    const user = this.userModel.findById(userId);
    if (!user) throw new Error(`User not found`);
    const images = await this.model.getImagesByUserId(userId);
    return images;
  }

  async getAllImages() {
    const images = await this.model.all();
    return images;
  }

  async getImagesByUserName(username: string) {
    const user = await this.userModel.findByName(username);
    if (!user || !user.user_id) throw new Error(`User not found`);

    const userImages = await this.getImagesByUserId(user.user_id);
    const images = userImages ?? [];
    return images;
  }

  async upvoteImage(upvotingUserId: number, imageId: number) {
    if (!upvotingUserId) throw new Error(`User not found`);
    if (!imageId) throw new Error(`Image not found`);

    const image = await this.getById(imageId);
    if (!image) throw new Error(`Image not found`);

    if (image.image_id === upvotingUserId) {
      throw new Error(`You cannot upvote your photos`);
    }

    await this.increaseCount(upvotingUserId, imageId);
    return image;
  }

  async increaseCount(userId: number, imageId: number) {
    const exists = await this.voteModel.isVoteExists(userId, imageId);
    if (exists) {
      const vote = await this.voteModel.getVote(userId, imageId);
      if (vote.value == 1) {
        throw new Error(`Duplicate votes are not allowed`);
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
    if (!image_url || !user_id) {
      throw new Error(`error of adding image, undefined image_url`);
    }
    await this.model.create(image_url, user_id);
  }
}
