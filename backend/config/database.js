const path = require('path');

// Database configuration
const isProduction = process.env.NODE_ENV === 'production';
const usePostgreSQL = process.env.DATABASE_URL || isProduction;

// Only require sqlite3 if we're not using PostgreSQL
let sqlite3;
if (!usePostgreSQL) {
  sqlite3 = require('sqlite3').verbose();
}

let db;
let initializeDatabase;

if (usePostgreSQL) {
  // PostgreSQL configuration for cloud database
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  db = {
    query: (text, params) => pool.query(text, params),
    get: (text, params) => pool.query(text, params).then(res => res.rows[0]),
    all: (text, params) => pool.query(text, params).then(res => res.rows),
    run: (text, params) => pool.query(text, params).then(res => ({ lastID: res.rows[0]?.id, changes: res.rowCount })),
    prepare: (text) => ({
      run: (params) => pool.query(text, params),
      finalize: () => {} // No-op for PostgreSQL
    })
  };

  initializeDatabase = async () => {
    try {
      // Create only chat-related tables
      await db.query(`
        CREATE TABLE IF NOT EXISTS chat_users (
          id SERIAL PRIMARY KEY,
          phone TEXT UNIQUE NOT NULL,
          session_id TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS user_chats (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES chat_users(id),
          session_id TEXT NOT NULL,
          message TEXT NOT NULL,
          is_bot BOOLEAN DEFAULT false,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ PostgreSQL Database initialized successfully');
      console.log('💬 Chat tables created');
      console.log('🌐 Database: PostgreSQL (Cloud)');
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  };

} else {
  // SQLite configuration for local development
  const dbPath = path.join(__dirname, '../data/kiik69.db');

  // Ensure data directory exists
  const fs = require('fs');
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Create SQLite database connection
  const sqliteDb = new sqlite3.Database(dbPath);

  // Create a wrapper object to provide consistent interface
  db = {
    query: (text, params) => new Promise((resolve, reject) => {
      sqliteDb.all(text, params, (err, rows) => {
        if (err) reject(err);
        else resolve({ rows });
      });
    }),
    get: (text, params) => new Promise((resolve, reject) => {
      sqliteDb.get(text, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    all: (text, params) => new Promise((resolve, reject) => {
      sqliteDb.all(text, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    run: (text, params) => new Promise((resolve, reject) => {
      sqliteDb.run(text, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    }),
    prepare: (text) => ({
      run: (params) => new Promise((resolve, reject) => {
        const stmt = sqliteDb.prepare(text);
        stmt.run(params, function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
        stmt.finalize();
      }),
      finalize: () => {}
    })
  };

  initializeDatabase = () => {
    return new Promise((resolve, reject) => {
      // Use the original sqlite3 database for initialization
      sqliteDb.serialize(() => {
        // Chat user authentication table
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS chat_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          phone TEXT UNIQUE NOT NULL,
          session_id TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // User chat history table
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS user_chats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER REFERENCES chat_users(id),
          session_id TEXT NOT NULL,
          message TEXT NOT NULL,
          is_bot BOOLEAN DEFAULT 0,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        sqliteDb.run(`INSERT OR IGNORE INTO chat_users (phone, session_id) 
                 VALUES ('guest', 'guest-session')`, (err) => {
          if (err) {
            console.error('Error creating guest user:', err);
          } else {
            console.log('✅ SQLite Database initialized successfully');
            console.log('💬 Chat tables created');
            console.log('💾 Database: SQLite (Local)');
          }
        });

        resolve();
      });
    });
  };
}

module.exports = {
  db,
  initializeDatabase
}; 