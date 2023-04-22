import { Database } from "sqlite3";
import { ImageModel } from "../models/image.model";
import { UserModel } from "../models/user.model";
import { VoteModel } from "../models/vote.mode";
import { NotFoundError, UpvoteError, ValidationError } from "../helpers/errors";
import { UserValidator } from "../validations/user.validator";
import { ImageValidator } from "../validations/image.validator";

export class ImageController {
  private model: ImageModel;
  private userModel: UserModel;
  private voteModel: VoteModel;
  private userValidator: UserValidator;
  private imageValidator: ImageValidator;

  constructor(db: Database) {
    this.model = new ImageModel(db);
    this.userModel = new UserModel(db)
    this.voteModel = new VoteModel(db);
    this.userValidator = new UserValidator();
    this.imageValidator = new ImageValidator();
  }

  async getById(id: number) {
    this.imageValidator.validateId(id);
    
    const image = await this.model.getImageById(id);
    return image;
  }

  async getImagesByUserId(userId: number) {
    this.userValidator.validateId(userId);
    
    const user = this.userModel.findById(userId);
    if (!user) throw new NotFoundError(`User not found`, `user_id: ${userId}`);
    const images = await this.model.getImagesByUserId(userId);
    return images;
  }

  async getAllImages() {
    const images = await this.model.all();
    return images;
  }

  async getImagesByUserName(username: string) {
    this.userValidator.validateName(username);

    const user = await this.userModel.findByName(username);
    if (!user || !user.user_id) throw new NotFoundError(`User not found`, `username: ${username}`);

    const userImages = await this.getImagesByUserId(user.user_id);
    const images = userImages ?? [];
    return images;
  }

  async upvoteImage(data: UpvoteImage) {    
    const upvotingUserId = data.user_id;
    const imageId = data.image_id;
    this.userValidator.validateId(upvotingUserId);
    this.imageValidator.validateId(imageId);
    
    const image = await this.getById(imageId);
    if (!image) throw new NotFoundError(`Image not found`, `image_id: ${imageId}`);

    if (image.user_id === upvotingUserId) {
      throw new UpvoteError(`You cannot upvote your photos`, `image_id: ${image.image_id}, user_id: ${image.user_id}`);
    }

    await this.increaseCount(upvotingUserId, imageId);
    return image;
  }

  async increaseCount(userId: number, imageId: number) {
    const exists = await this.voteModel.isVoteExists(userId, imageId);
    if (exists) {
      const vote = await this.voteModel.getVote(userId, imageId);
      if (vote.value == 1) {
        throw new UpvoteError(`Duplicate votes are not allowed`, `image_id: ${imageId}, user_id: ${userId}`);
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
        throw new UpvoteError(`Duplicate votes are not allowed`, `image_id: ${imageId}, user_id: ${userId}`);
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

  async addImage(data: NewImage) {
    const { image_url, user_id } = data;
    this.userValidator.validateId(user_id);
    this.imageValidator.validateUrl(image_url);

    await this.model.create(image_url, user_id);
  }
}
