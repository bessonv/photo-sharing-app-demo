import { Database } from "sqlite3";
import { connect, insert, update, get, all } from "./db/db";

export interface UserModel {
  _db: Database;
}

export class UserModel implements UserModel {
  constructor(private db: Database) {
    this._db = db;
  }

  public async create(data: User) {
    const { username, email, password } = data;
    const sql = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
    
    const lastID = await insert(this._db, sql, [username, email, password]);
    
    return { id: lastID, username, email, password };
  }

  public async update(id: number, data: User) {
    const { username, email, password } = data;
    const sql = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?;';
    const changes = await update(this._db, sql, [username, email, password, id]);
    if (changes === 0) return undefined;
    return { id, username, email, password };
  }

  public async all() {
    const sql = "SELECT * FROM users;";
    
    const users: User[] = await all<User>(this._db, sql);
    return users;
  }

  public async findById(id: number) {
    const sql = "SELECT * FROM users WHERE id=?;";

    const user = await get<User>(this._db, sql, [id]);

    return user;
  }

  public async findByCredentials(username: string, email: string) {
    const sql = "SELECT * FROM users WHERE username=? AND email=?";

    const user = await get<User>(this._db, sql,[username, email]);

    return user;
  }

  public async findIfExists(username: string, password: string) {
    const sql = "SELECT * FROM users WHERE username=? AND password=?";

    const user = await get<User>(this._db, sql, [username, password]);

    return user;
  }
}