import sqlite3 from "sqlite3";

const filepath = './db/photoshare.db3';

export async function connect() {
  sqlite3.verbose();
  const db = new sqlite3.Database(filepath);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      image_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      FOREIGN KEY (user_id)
        REFERENCES users (user_id)
          ON DELETE CASCADE
          ON UPDATE NO ACTION
    );
  `);
    
  await db.exec(`
    CREATE TABLE IF NOT EXISTS votes (
      vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      image_id INTEGER NOT NULL,
      value INTEGER NOT NULL,
      FOREIGN KEY (image_id)
        REFERENCES images
          ON DELETE CASCADE
          ON UPDATE NO ACTION
    );
  `);
  
  return db;
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
  query: string,
  params: (number | string)[] = []
): Promise<T[]>{
  return new Promise((resolve, reject) => {
    db.all(query, params, function(err, rows: T[]){
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export function remove(
  db: sqlite3.Database, 
  query: string,
  params: (number | string)[] = []
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}
