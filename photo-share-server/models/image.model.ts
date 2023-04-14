import { Database } from "sqlite3";
import { insert, update, get, all } from "../db/db";

export class ImageModel {
  private _db: Database;

  constructor(db: Database) {
    this._db = db;
  }

  public async create(image_url: string, user_id: number) {
    // const { image_url, user_id } = data;
    const sql = 'INSERT INTO images (image_url, user_id) VALUES (?, ?, ?)';

    const lastID = await insert(this._db, sql, [image_url, user_id])
      .catch((e) => {
        console.error(e);
        return null;
      });

    return lastID ? { image_id: lastID, image_url, user_id } : null;
  }

  public async update(id: number, data: Image) {
    const { image_url, user_id } = data;
    const sql = 'UPDATE images SET image_url = ?, user_id = ? WHERE user_id = ?;';

    const changes = await update(this._db, sql, [image_url, user_id, id])
      .catch((e) => {
        console.error(e);
        return null;
      });

    return changes ? { image_id: id, image_url, user_id } : null;
  }

  public async all() {
    const sql = `
      SELECT img.*, SUM(v.value) as vote_count FROM images as img
      LEFT JOIN votes as v USING(image_id)
      GROUP BY img.image_id;
    `;

    const images: Image[] | null = await all<Image>(this._db, sql)
      .catch((e) => {
        console.error(e);
        return null;
      });
    return images;
  }

  public async getImagesByUserId(userId: number) {
    const sql = `
      SELECT img.*, SUM(v.value) as vote_count FROM images as img
      LEFT JOIN votes as v USING(image_id)
      WHERE img.user_id = ?
      GROUP BY img.image_id;
    `;

    const images: Image[] | null = await all<Image>(this._db, sql, [ userId ])
      .catch((e) => {
        console.error(e);
        return null;
      });
    return images;
  }

  public async getImageById(id: number) {
    const sql = `
      SELECT img.*, SUM(v.value) as vote_count FROM images as img
      LEFT JOIN votes as v USING(image_id)
      WHERE img.image_id = ?
      GROUP BY img.image_id;
    `;

    const image: Image | null = await get<Image>(this._db, sql, [ id ])
      .catch((e) => {
        console.error(e);
        return null;
      });
    return image;
  }
}
