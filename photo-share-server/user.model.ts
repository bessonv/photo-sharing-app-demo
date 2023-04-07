import { Database } from "sqlite3";
import { connect } from "../db/db";

export interface UserModel {
  _db: Database;
  id: string;
  username: string;
  password: string;
  email: string;

}

export class UserModel implements UserModel {
  constructor(private db: Database) {
    this._db = db;
  }

  public async create(data: User) {
    const { username, email, password } = data;
    const { lastID: id } = await this._db.run(`
      INSERT INTO users (name, email, passwords)
      VALUES (?,?,?)
    `,username, email, password);
    return ( id, username, email, password );
  }
}