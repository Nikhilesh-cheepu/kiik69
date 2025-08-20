require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const fixDatabaseSchema = async () => {
  try {
    console.log('🔧 Fixing database schema...');

    // Add missing columns to user_chats table
    await pool.query(`
      ALTER TABLE user_chats 
      ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT false
    `);

    // Add missing columns to chat_users table
    await pool.query(`
      ALTER TABLE chat_users 
      ADD COLUMN IF NOT EXISTS email TEXT UNIQUE
    `);

    await pool.query(`
      ALTER TABLE chat_users 
      ADD COLUMN IF NOT EXISTS session_id TEXT UNIQUE
    `);

    // Remove old OTP columns if they exist
    await pool.query(`
      ALTER TABLE chat_users 
      DROP COLUMN IF EXISTS otp
    `);

    await pool.query(`
      ALTER TABLE chat_users 
      DROP COLUMN IF EXISTS otp_expires_at
    `);

    console.log('✅ Database schema fixed successfully!');
    
    // Verify the schema
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_chats' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 user_chats table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
  } finally {
    await pool.end();
  }
};

fixDatabaseSchema();
