import { Database } from "sqlite3";
import { UserModel } from "../models/user.model";
import { getHash } from "../helpers/hash";

export class UserController {
  private model: UserModel;

  constructor(db: Database) {
    this.model = new UserModel(db);
  }

  async logUser(username: string, password: string) {
    if (!username || !password) {
      throw new Error(`login error, empty username or password`);
    }
    const user = await this.getUser(username, password);
    return user;
  }

  async registerUser(username: string, email: string, password: string) {
    if (!username || !email || !password) {
      throw new Error(`register error, empty username or password`);
    }
    const user = await this.addUser(email, username, password);
    return user;
  }

  async getUser(username: string, password: string) {
    const passwordHash = getHash(password);
    const user = await this.model.findIfExists(username, passwordHash);
    if (!user) throw new Error(`login error, user not found`);;
    return user;
  }  

  async addUser(email: string, username: string, password: string) {
    const existingUser = await this.model.findByCredentials(username, email);

    if (existingUser) throw new Error(`User already exists`);
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

    if (!user) return null;
    return user;
  }

  async getUserById(id: number) {
    const user = await this.model.findById(id);

    if (!user) return null;
    return user;
  }
}
