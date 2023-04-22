import { Database } from "sqlite3";
import { insert, update, get, all } from "../../db/db";
import { DatabaseError } from "../helpers/errors";

export class UserModel {
  private _db: Database;

  constructor(private db: Database) {
    this._db = db;
  }

  public async create(data: NewUser) {
    const { username, email, password } = data;
    const sql = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
    
    const lastID = await insert(this._db, sql, [username, email, password])
      .catch((e) => {
        throw new DatabaseError(`Error while creating user: ${e}`);
      });
    return lastID ? { user_id: lastID, username, email, password } : null;
  }

  public async update(id: number, data: User) {
    const { username, email, password } = data;
    const sql = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?;';
    const changes = await update(this._db, sql, [username, email, password, id])
      .catch((e) => {
        throw new DatabaseError(`Error while updating user: ${e}`);
      });
    return changes ? { user_id: id, username, email, password } : null;
  }

  public async all() {
    const sql = "SELECT * FROM users;";
    
    const users: User[] | null = await all<User>(this._db, sql)
      .catch((e) => {
        throw new DatabaseError(`Error while getting all users: ${e}`);
      });

    return users;
  }

  public async findById(id: number) {
    const sql = "SELECT * FROM users WHERE user_id=?;";

    const user = await get<User>(this._db, sql, [id])
      .catch((e) => {
        throw new DatabaseError(`Error while getting user: ${e}`);
      });

    return user;
  }

  public async findByName(username: string) {
    const sql = "SELECT * FROM users WHERE username=?;";

    const user = await get<User>(this._db, sql, [username])
      .catch((e) => {
        throw new DatabaseError(`Error while getting user: ${e}`);
      });
    return user;
  }

  public async findByCredentials(username: string, email: string) {
    const sql = "SELECT * FROM users WHERE username=? AND email=?";

    const user = await get<User>(this._db, sql,[username, email])
      .catch((e) => {
        throw new DatabaseError(`Error while getting user: ${e}`);
      });

    return user;
  }

  public async findIfExists(username: string, password: string) {
    const sql = "SELECT * FROM users WHERE username=? AND password=?";

    const user = await get<User>(this._db, sql, [username, password])
      .catch((e) => {
        throw new DatabaseError(`Error while getting user: ${e}`);
      });

    return user;
  }
}
