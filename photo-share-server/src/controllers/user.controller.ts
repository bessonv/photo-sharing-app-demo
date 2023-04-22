import { Database } from "sqlite3";
import { UserModel } from "../models/user.model";
import { getHash } from "../helpers/hash";
import { LoginError, NotFoundError, ValidationError } from "../helpers/errors";
import { UserValidator } from "../validations/user.validator";

export class UserController {
  private model: UserModel;
  private userValidator: UserValidator;

  constructor(db: Database) {
    this.model = new UserModel(db);
    this.userValidator = new UserValidator();
  }

  async logUser(data: LogUser) {
    const { username, password } = data;
    this.userValidator.validateName(username);
    this.userValidator.validatePassword(password);

    const user = await this.getUser(username, password);
    return user;
  }

  async registerUser(data: NewUser) {
    const { email, username, password } = data;
    this.userValidator.validateEmail(email);
    this.userValidator.validateName(username);
    this.userValidator.validatePassword(password);

    const user = await this.addUser(email, username, password);
    return user;
  }

  async getUser(username: string, password: string) {
    this.userValidator.validateName(username);
    this.userValidator.validatePassword(password);

    const passwordHash = getHash(password);
    const user = await this.model.findIfExists(username, passwordHash);
    if (!user) throw new LoginError(`login error, user ${username} not found`);;
    return user;
  }  

  async addUser(email: string, username: string, password: string) {
    const existingUser = await this.model.findByCredentials(username, email);
    if (existingUser) throw new LoginError(`User already exists`);
    const passwordHash = getHash(password);
    const newUser: NewUser = {
      username,
      email,
      password: passwordHash
    }
    const user = await this.model.create(newUser);
    return user;    
  }

  async getUserByName(username: string) {
    const user = await this.model.findByName(username);
    if (!user) throw new NotFoundError('User not found', `username: ${username}`);
    return user;
  }

  async getUserById(id: number) {
    const user = await this.model.findById(id);
    if (!user) throw new NotFoundError('User not found', `user_id: ${id}`);
    return user;
  }
}
