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

    // ----- Admin & section content (full-stack CMS) -----
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS site_sections (
        id SERIAL PRIMARY KEY,
        section_key TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS section_items (
        id SERIAL PRIMARY KEY,
        section_key TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        data JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_section_items_section_key ON section_items(section_key);`);

    await db.query(`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        blob_url TEXT NOT NULL,
        filename TEXT,
        mime_type TEXT,
        file_size INTEGER,
        key TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Analytics events (click tracking, etc.)
    await db.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type TEXT NOT NULL,
        page TEXT,
        section TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bookings
    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name TEXT,
        phone TEXT,
        party_size INTEGER,
        date TEXT,
        time TEXT,
        message TEXT,
        source TEXT,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default hero section if missing
    const heroExists = await db.get(
      "SELECT id FROM site_sections WHERE section_key = $1",
      ["hero"]
    );
    if (!heroExists) {
      await db.query(
        `INSERT INTO site_sections (section_key, name, data) VALUES ($1, $2, $3)`,
        [
          "hero",
          "Hero",
          JSON.stringify({
            videoUrl:
              "https://scaznok0vgtcf5lu.public.blob.vercel-storage.com/hero%20%20copy.MP4",
          }),
        ]
      );
      console.log("📌 Default hero section seeded");
    }

    // Seed experience section + default package groups if missing
    const experienceExists = await db.get(
      "SELECT id FROM site_sections WHERE section_key = $1",
      ["experience"]
    );
    if (!experienceExists) {
      await db.query(
        `INSERT INTO site_sections (section_key, name, data) VALUES ($1, $2, $3)`,
        [
          "experience",
          "Experience",
          JSON.stringify({
            label: "The Experience",
            heading: "More Than a Sports Bar",
            supportingText:
              "Bowling · Live sports · Pool & darts · Food & drinks · Private parties",
          }),
        ]
      );
      const g1 = await db.get(
        "INSERT INTO section_items (section_key, sort_order, data) VALUES ($1, $2, $3) RETURNING id",
        ["experience_package_groups", 0, JSON.stringify({ label: "Food packages" })]
      );
      const g2 = await db.get(
        "INSERT INTO section_items (section_key, sort_order, data) VALUES ($1, $2, $3) RETURNING id",
        ["experience_package_groups", 1, JSON.stringify({ label: "Drink packages" })]
      );
      const g3 = await db.get(
        "INSERT INTO section_items (section_key, sort_order, data) VALUES ($1, $2, $3) RETURNING id",
        ["experience_package_groups", 2, JSON.stringify({ label: "Games packages" })]
      );
      const g4 = await db.get(
        "INSERT INTO section_items (section_key, sort_order, data) VALUES ($1, $2, $3) RETURNING id",
        ["experience_package_groups", 3, JSON.stringify({ label: "Custom packages" })]
      );
      const insertItem = (groupId, sortOrder, name, description, price) =>
        db.query(
          "INSERT INTO section_items (section_key, sort_order, data) VALUES ($1, $2, $3)",
          [
            "experience_package_items",
            sortOrder,
            JSON.stringify({ groupId, name, description, price }),
          ]
        );
      await insertItem(g1.id, 0, "Eat & Drink @₹128", "12PM – 8PM · Unlimited", "₹128");
      await insertItem(g2.id, 0, "House pours", "Selected drinks", "From ₹99");
      await insertItem(g3.id, 0, "Bowling lane (per hour)", "Up to 6 people", "From ₹800");
      await insertItem(g4.id, 0, "Private hire", "Custom quote", "On request");
      console.log("📌 Experience section + package groups seeded");
    }

    console.log('✅ PostgreSQL Database initialized successfully');
    console.log('💬 Chat tables created');
    console.log('🎉 Party packages table created');
    console.log('📋 Menu items table created');
    console.log('🔐 Admin users & site_sections & section_items & media created');
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