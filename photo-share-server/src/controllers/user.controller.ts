import { Database } from "sqlite3";
import { UserModel } from "../models/user.model";
import { getHash } from "../helpers/hash";
import { LoginError, NotFoundError, ValidationError } from "../helpers/errors";

export class UserController {
  private model: UserModel;

  constructor(db: Database) {
    this.model = new UserModel(db);
  }

  async logUser(username: string, password: string) {
    if (!(typeof username == "string")) {
      throw new ValidationError(`Username has wrong type ${typeof username}, must be string`);
    }
    if (!(typeof password == "string")) {
      throw new ValidationError(`Password has wrong type ${typeof password}, must be string`);
    }
    const user = await this.getUser(username, password);
    return user;
  }

  async registerUser(username: string, email: string, password: string) {
    if (!(typeof username == "string")) {
      throw new ValidationError(`Username has wrong type ${typeof username}, must be string`);
    }
    if (!(typeof email == "string")) {
      throw new ValidationError(`Email has wrong type ${typeof email}, must be string`);
    }
    if (!(typeof password == "string")) {
      throw new ValidationError(`Password has wrong type ${typeof password}, must be string`);
    }
    const user = await this.addUser(email, username, password);
    return user;
  }

  async getUser(username: string, password: string) {
    if (!(typeof username == "string")) {
      throw new ValidationError(`Username has wrong type ${typeof username}, must be string`);
    }
    if (!(typeof password == "string")) {
      throw new ValidationError(`Password has wrong type ${typeof password}, must be string`);
    }
    const passwordHash = getHash(password);
    const user = await this.model.findIfExists(username, passwordHash);
    if (!user) throw new LoginError(`login error, user not found`);;
    return user;
  }  

  async addUser(email: string, username: string, password: string) {
    const existingUser = await this.model.findByCredentials(username, email);
    if (existingUser) throw new LoginError(`User already exists`);
    const passwordHash = getHash(password);
    const newUser: User = {
      username,
      email,
      password: passwordHash
    }
    const user = await this.model.create(newUser);
    return user;    
  }

  async getUserByName(username: string) {
    const user = await this.model.findByName(username);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async getUserById(id: number) {
    const user = await this.model.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}
