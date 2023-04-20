import { Database } from "sqlite3";
import { ImageModel } from "../models/image.model";
import { UserModel } from "../models/user.model";
import { VoteModel } from "../models/vote.mode";
import { NotFoundError, UpvoteError, ValidationError } from "../helpers/errors";

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
    if (!(typeof id == "number")) {
      throw new ValidationError(`Image id has wrong type ${typeof id}, must be number`);
    }
    const image = await this.model.getImageById(id);
    return image;
  }

  async getImagesByUserId(userId: number) {
    if (!(typeof userId == "number")) {
      throw new ValidationError(`User Id has wrong type ${typeof userId}, must be number`);
    }
    const user = this.userModel.findById(userId);
    if (!user) throw new NotFoundError(`User not found`);
    const images = await this.model.getImagesByUserId(userId);
    return images;
  }

  async getAllImages() {
    const images = await this.model.all();
    return images;
  }

  async getImagesByUserName(username: string) {
    const user = await this.userModel.findByName(username);
    if (!user || !user.user_id) throw new NotFoundError(`User not found`);

    const userImages = await this.getImagesByUserId(user.user_id);
    const images = userImages ?? [];
    return images;
  }

  async upvoteImage(upvotingUserId: number, imageId: number) {
    if (!(typeof upvotingUserId == "number")) {
      throw new ValidationError(`User Id has wrong type ${typeof upvotingUserId}, must be number`);
    }
    if (!(typeof imageId == "number")) {
      throw new ValidationError(`Image Id has wrong type ${typeof upvotingUserId}, must be number`);
    }
    const image = await this.getById(imageId);
    if (!image) throw new NotFoundError(`Image not found`);

    if (image.image_id === upvotingUserId) {
      throw new UpvoteError(`You cannot upvote your photos`);
    }

    await this.increaseCount(upvotingUserId, imageId);
    return image;
  }

  async increaseCount(userId: number, imageId: number) {
    const exists = await this.voteModel.isVoteExists(userId, imageId);
    if (exists) {
      const vote = await this.voteModel.getVote(userId, imageId);
      if (vote.value == 1) {
        throw new UpvoteError(`Duplicate votes are not allowed`);
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
        throw new UpvoteError(`Duplicate votes are not allowed`);
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
    if (!(typeof image_url == "string")) {
      throw new ValidationError(`Image url has wrong type ${typeof image_url}, must be string`);
    }
    if (!(typeof user_id == "number")) {
      throw new ValidationError(`User Id has wrong type ${typeof user_id}, must be number`);
    }
    await this.model.create(image_url, user_id);
  }
}
