import sqlite3 from "sqlite3";

const filepath = './db/photoshare.db3';

export async function connect() {
  sqlite3.verbose();
  const db = new sqlite3.Database(filepath);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      vote_count INTEGER NOT NULL,
      _ref TEXT
    );
  `);
  // await populate(db);
  
  return db;
}

async function populate(db: sqlite3.Database) {
  await db.exec(`
    INSERT INTO users (username, password, email)
    VALUES
      ('user', 'dffddf', 'user@email.com'),
      ('user2', 'dffddf', 'user2@email.com');
  `);
  await db.exec(`
    INSERT INTO images (image_url, vote_count, user_id, _ref)
    VALUES
      (
        'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1652341068/EducationHub/photos/ocean-waves.jpg',
        0,
        1,
        'user@email.com'
      ),
      (
        'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZvcmVzdHxlbnwwfHwwfHw%3D&w=1000&q=80',
        0,
        1,
        'user@email.com'
      ),
      (
        'https://media.istockphoto.com/id/1288385045/photo/snowcapped-k2-peak.jpg?s=612x612&w=0&k=20&c=sfA4jU8kXKZZqQiy0pHlQ4CeDR0DxCxXhtuTDEW81oo=',
        0,
        1,
        'user@email.com'
      )
  `);
}

export function insert(
  db: sqlite3.Database, 
  query: string, 
  values: (string | number)[]
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(query, values, function(err){
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

export function update(
  db: sqlite3.Database, 
  query: string, 
  values: (string | number)[]
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(query, values, function(err){
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

export function get<T>(
  db: sqlite3.Database,
  query: string,
  params: (number | string)[]
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    db.get(query, params, function(err, row: T) {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export function all<T>(
  db: sqlite3.Database, 
  query: string
): Promise<T[]>{
  return new Promise((resolve, reject) => {
    db.all(query, function(err, rows: T[]){
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
