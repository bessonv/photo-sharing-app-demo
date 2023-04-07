import sqlite3 from "sqlite3";

const filepath = './photoshare.db';

export async function connect() {
  const db = new sqlite3.Database(filepath);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,,
      user_id: INTEGER NOT NULL,
      images_url: TEXT NOT NULL,
      vote_count: INTEGER NOT NULL,
    );
  `);

  return db;
}