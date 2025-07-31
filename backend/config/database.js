const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database configuration
const isProduction = process.env.NODE_ENV === 'production';
const usePostgreSQL = process.env.DATABASE_URL || isProduction;

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
      // Create tables
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS menu_items (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          category VARCHAR(100) NOT NULL,
          image_url VARCHAR(500),
          is_available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          date DATE NOT NULL,
          time TIME,
          image_url VARCHAR(500),
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS gallery_items (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          image_url VARCHAR(500) NOT NULL,
          video_url VARCHAR(500),
          category VARCHAR(100) DEFAULT 'general',
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS party_packages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          includes TEXT,
          image_url VARCHAR(500),
          is_available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS games (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          type VARCHAR(100) NOT NULL,
          image_url VARCHAR(500),
          is_available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'unread',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert default admin user
      const bcrypt = require('bcryptjs');
      const defaultPassword = bcrypt.hashSync('admin123', 10);
      
      await db.query(`
        INSERT INTO users (username, email, password_hash, role) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
      `, ['admin', 'admin@kiik69.com', defaultPassword, 'admin']);

      // Insert sample menu items
      const sampleMenuItems = [
        ['Classic Burger', 'Juicy beef burger with fresh lettuce and tomato', 12.99, 'Food', null, true],
        ['Chicken Wings', 'Crispy wings with your choice of sauce', 9.99, 'Food', null, true],
        ['Craft Beer', 'Local craft beer selection', 6.99, 'Drinks', null, true],
        ['Margarita', 'Fresh lime margarita with premium tequila', 8.99, 'Drinks', null, true]
      ];

      for (const item of sampleMenuItems) {
        await db.query(`
          INSERT INTO menu_items (name, description, price, category, image_url, is_available) 
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, item);
      }

      // Insert sample events
      const sampleEvents = [
        ['Live Music Night', 'Enjoy live performances every Friday', '2024-01-15', '20:00', null, true],
        ['Sports Game Screening', 'Watch the big game with us', '2024-01-20', '19:00', null, true],
        ['Karaoke Night', 'Sing your heart out every Saturday', '2024-01-22', '21:00', null, false]
      ];

      for (const event of sampleEvents) {
        await db.query(`
          INSERT INTO events (title, description, date, time, image_url, is_featured) 
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, event);
      }

      console.log('✅ PostgreSQL Database initialized successfully');
      console.log('🔑 Default admin credentials: admin / admin123');
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
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new sqlite3.Database(dbPath);

  initializeDatabase = () => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Users table for admin authentication
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Menu items table
        db.run(`CREATE TABLE IF NOT EXISTS menu_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          category TEXT NOT NULL,
          image_url TEXT,
          is_available BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Events table
        db.run(`CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          date DATE NOT NULL,
          time TIME,
          image_url TEXT,
          is_featured BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Gallery items table
        db.run(`CREATE TABLE IF NOT EXISTS gallery_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          image_url TEXT NOT NULL,
          video_url TEXT,
          category TEXT DEFAULT 'general',
          is_featured BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Party packages table
        db.run(`CREATE TABLE IF NOT EXISTS party_packages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          includes TEXT,
          image_url TEXT,
          is_available BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Games table
        db.run(`CREATE TABLE IF NOT EXISTS games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL,
          image_url TEXT,
          is_available BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Contact messages table
        db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'unread',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Insert default admin user if not exists
        const bcrypt = require('bcryptjs');
        const defaultPassword = bcrypt.hashSync('admin123', 10);
        
        db.run(`INSERT OR IGNORE INTO users (username, email, password_hash, role) 
                 VALUES ('admin', 'admin@kiik69.com', ?, 'admin')`, 
                 [defaultPassword], (err) => {
          if (err) {
            console.error('Error creating default admin:', err);
          } else {
            console.log('✅ SQLite Database initialized successfully');
            console.log('🔑 Default admin credentials: admin / admin123');
            console.log('💾 Database: SQLite (Local)');
          }
        });

        // Insert sample menu items
        const sampleMenuItems = [
          ['Classic Burger', 'Juicy beef burger with fresh lettuce and tomato', 12.99, 'Food', null, 1],
          ['Chicken Wings', 'Crispy wings with your choice of sauce', 9.99, 'Food', null, 1],
          ['Craft Beer', 'Local craft beer selection', 6.99, 'Drinks', null, 1],
          ['Margarita', 'Fresh lime margarita with premium tequila', 8.99, 'Drinks', null, 1]
        ];

        const insertMenuStmt = db.prepare(`INSERT OR IGNORE INTO menu_items 
          (name, description, price, category, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)`);
        
        sampleMenuItems.forEach(item => {
          insertMenuStmt.run(item);
        });
        insertMenuStmt.finalize();

        // Insert sample events
        const sampleEvents = [
          ['Live Music Night', 'Enjoy live performances every Friday', '2024-01-15', '20:00', null, 1],
          ['Sports Game Screening', 'Watch the big game with us', '2024-01-20', '19:00', null, 1],
          ['Karaoke Night', 'Sing your heart out every Saturday', '2024-01-22', '21:00', null, 0]
        ];

        const insertEventStmt = db.prepare(`INSERT OR IGNORE INTO events 
          (title, description, date, time, image_url, is_featured) VALUES (?, ?, ?, ?, ?, ?)`);
        
        sampleEvents.forEach(event => {
          insertEventStmt.run(event);
        });
        insertEventStmt.finalize();

        resolve();
      });
    });
  };
}

module.exports = {
  db,
  initializeDatabase
}; 