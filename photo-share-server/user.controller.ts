import { Database } from "sqlite3";
import { UserModel } from "./user.model";


export interface UserController {
}

export class UserController implements UserController {
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
}

// module.exports = UserController;
