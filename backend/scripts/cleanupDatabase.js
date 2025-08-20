const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Tables to keep (with data)
const tablesToKeep = [
  'chat_users',
  'user_chats', 
  'party_packages',
  'menu_items',
  'games',
  'gallery_items'
];

// Tables to drop (not needed)
const tablesToDrop = [
  'assets',
  'contact_messages',
  'events',
  'user_bookings',
  'users'
];

// Clean up database
const cleanupDatabase = async () => {
  try {
    console.log('🔄 Starting database cleanup...');
    
    // Check which tables exist
    const existingTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Existing tables:', existingTables.rows.map(row => row.table_name));
    
    // Drop unnecessary tables
    for (const tableName of tablesToDrop) {
      try {
        const tableExists = existingTables.rows.some(row => row.table_name === tableName);
        if (tableExists) {
          await pool.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
          console.log(`✅ Dropped table: ${tableName}`);
        } else {
          console.log(`ℹ️ Table ${tableName} doesn't exist, skipping`);
        }
      } catch (error) {
        console.error(`❌ Error dropping table ${tableName}:`, error.message);
      }
    }
    
    // Verify required tables exist
    console.log('\n🔍 Checking required tables...');
    for (const tableName of tablesToKeep) {
      try {
        const result = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
        const count = parseInt(result.rows[0].count);
        console.log(`✅ Table ${tableName}: ${count} records`);
      } catch (error) {
        console.error(`❌ Error checking table ${tableName}:`, error.message);
      }
    }
    
    console.log('\n🎉 Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  } finally {
    await pool.end();
  }
};

// Run the cleanup
cleanupDatabase().catch(console.error);
