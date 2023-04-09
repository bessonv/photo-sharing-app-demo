import { Database } from "sqlite3";
import { UserModel } from "../models/user.model";

export class UserController {
  private model: UserModel;

  constructor(db: Database) {
    this.model = new UserModel(db);
  }

  async getUser(username: string, password: string) {
    const user = await this.model.findIfExists(username, password);
    if (!user) return null;
    return user;
  }  

  async addUser(email: string, username: string, password: string) {
    const existingUser = await this.model.findByCredentials(username, email);

    if (existingUser) return null;
    const newUser = await this.model.create({ username, email, password });
    return newUser;    
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

// module.exports = UserController;
