import { Database } from "sqlite3";
import { insert, update, get, all } from "../db/db";

export class ImageModel {
  private _db: Database;

  constructor(db: Database) {
    this._db = db;
  }

  public async create(image_url: string, user_id: number, _ref: string) {
    // const { image_url, user_id, _ref } = data;
    const sql = 'INSERT INTO images (image_url, vote_count, user_id, _ref) VALUES (?, 0, ?, ?)';

    const lastID = await insert(this._db, sql, [image_url, user_id, _ref]);

    return { id: lastID, image_url, vote_count: 0, user_id, _ref };
  }

  public async update(id: number, data: Image) {
    const { image_url, vote_count, user_id, _ref } = data;
    const sql = 'UPDATE images SET image_url = ?, vote_count = ?, user_id = ?, _ref = ? WHERE id = ?;';

    const changes = await update(this._db, sql, [image_url, vote_count, user_id, _ref]);

    if (changes === 0) return null;
    return { id, image_url, vote_count, user_id, _ref };
  }

  public async all() {
    const sql = "SELECT * FROM images;";

    const images: Image[] = await all<Image>(this._db, sql);
    return images;
  }

  public async increaseCount(id: number) {
    const count = await this.getCount(id);
    const sql = 'UPDATE images SET vote_count = ? WHERE id = ?';

    const changes = await update(this._db, sql, [ count + 1, id ]);

    if (changes === 0) return null;
    return count + 1;
  }

  public async decreaseCount(id: number) {
    const count = await this.getCount(id);
    // if (count === 0) return null;

    const sql = 'UPDATE images SET vote = ? WHERE id = ?';

    const changes = await update(this._db, sql, [ count - 1, id ]);

    if (changes === 0) return null;
    return count - 1;
  }

  public async getCount(id: number) {
    const sql = 'SELECT * FROM images WHERE id = ?;';

    const image = await get<Image>(this._db, sql, [ id ]);

    return image.vote_count;
  }

  public async getImagesByUserId(userId: number) {
    const sql = 'SELECT * FROM images WHERE user_id = ?;';

    const images: Image[] = await all<Image>(this._db, sql, [ userId ]);
    return images;
  }

  public async getImageById(id: number) {
    const sql = 'SELECT * FROM images WHERE id = ?;';

    const image: Image = await get<Image>(this._db, sql, [ id ]);
    return image;
  }
}
