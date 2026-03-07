const { Pool } = require('pg');
const connectionString = require('./connectionString');

// Database configuration - using only PostgreSQL
const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database interface
const db = {
  query: (text, params) => pool.query(text, params),
  get: (text, params) => pool.query(text, params).then(res => res.rows[0]),
  all: (text, params) => pool.query(text, params).then(res => res.rows),
  run: (text, params) => pool.query(text, params).then(res => ({ lastID: res.rows[0]?.id, changes: res.rowCount })),
  prepare: (text) => ({
    run: (params) => pool.query(text, params),
    finalize: () => {} // No-op for PostgreSQL
  })
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create chat_users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_users (
        id SERIAL PRIMARY KEY,
        phone TEXT UNIQUE,
        email TEXT UNIQUE,
        session_id TEXT UNIQUE NOT NULL,
        is_verified BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT phone_or_email CHECK (phone IS NOT NULL OR email IS NOT NULL)
      )
    `);

    // Create user_chats table
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

    // Create party_packages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS party_packages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        includes TEXT,
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create menu_items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        image TEXT,
        menu_type TEXT NOT NULL,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ PostgreSQL Database initialized successfully');
    console.log('💬 Chat tables created');
    console.log('🎉 Party packages table created');
    console.log('📋 Menu items table created');
    console.log('🌐 Database: PostgreSQL (Cloud)');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

module.exports = {
  db,
  initializeDatabase
}; 