const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'habits.db');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('📦 Connected to SQLite database');
          resolve(this.db);
        }
      });
    });
  }

  async initDB() {
    await this.connect();
    
    // Create habits table
    const createHabitsTable = `
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create checkins table
    const createCheckinsTable = `
      CREATE TABLE IF NOT EXISTS checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        date DATE NOT NULL,
        status TEXT CHECK(status IN ('done', 'missed')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
        UNIQUE(habit_id, date)
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(createHabitsTable, (err) => {
          if (err) {
            console.error('Error creating habits table:', err.message);
            reject(err);
          }
        });

        this.db.run(createCheckinsTable, (err) => {
          if (err) {
            console.error('Error creating checkins table:', err.message);
            reject(err);
          } else {
            console.log('✅ Database tables created successfully');
            resolve();
          }
        });
      });
    });
  }

  getDB() {
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

const database = new Database();

module.exports = database;