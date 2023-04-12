import { Database } from "sqlite3";
import { insert, update, get, all, remove } from "../db/db";

export class VoteModel {
  private _db: Database;

  constructor(db: Database) {
    this._db = db;
  }

  public async create(userId: number, imageId: number, value: -1 | 0 | 1) {
    const sql = 'INSERT INTO votes (user_id, image_id, value) VALUES (?, ?, ?)';

    const lastID = await insert(this._db, sql, [userId, imageId, value]);
    return { id: lastID, userId, imageId, value };
  }

  public async update(userId: number, imageId: number, value: -1 | 0 | 1) {
    const sql = 'UPDATE votes SET value = ? WHERE user_id = ?, image_id = ?;';

    const changes = await update(this._db, sql, [value, userId, imageId]);
    if (changes === 0) return null;
    return { value };
  }

  public async delete(id: number) {
    const sql = `DELETE FROM votes WHERE vote_id = ?`;

    const changes = await remove(this._db, sql, [id]);
    return { changes };
  }

  public async isVoteExists(userId: number, imageId: number) {
    const sql = `SELECT COUNT(*) FROM votes WHERE user_id = ? AND image_id = ?`;

    const count = await get<number>(this._db, sql, [userId, imageId]);
    return count > 0;
  }

  public async getVote(userId: number, imageId: number) {
    const sql = `SELECT * FROM votes WHERE user_id = ? AND image_id = ?`;

    const vote = await get<Vote>(this._db, sql, [userId, imageId]);
    return vote;
  }

  public async getImageVoteCount(id: number) {
    const sql = `
      SELECT SUM(votes.value) FROM votes WHERE image_id = ?
    `;

    const count = await get<number>(this._db, sql, [id]);
    return count;
  }
}