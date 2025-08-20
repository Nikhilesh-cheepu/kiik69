const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/kiik69.db');

console.log('🔄 Starting database migration...');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Add missing columns to chat_users table
  db.run(`ALTER TABLE chat_users ADD COLUMN otp TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ Error adding otp column:', err.message);
    } else {
      console.log('✅ Added otp column');
    }
  });

  db.run(`ALTER TABLE chat_users ADD COLUMN otp_expires_at TIMESTAMP`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ Error adding otp_expires_at column:', err.message);
    } else {
      console.log('✅ Added otp_expires_at column');
    }
  });

  db.run(`ALTER TABLE chat_users ADD COLUMN is_verified BOOLEAN DEFAULT false`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ Error adding is_verified column:', err.message);
    } else {
      console.log('✅ Added is_verified column');
    }
  });

  db.run(`ALTER TABLE chat_users ADD COLUMN last_login TIMESTAMP`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ Error adding last_login column:', err.message);
    } else {
      console.log('✅ Added last_login column');
    }
  });

  // Check table structure
  db.all(`PRAGMA table_info(chat_users)`, (err, rows) => {
    if (err) {
      console.error('❌ Error checking table structure:', err.message);
    } else {
      console.log('📋 Current chat_users table structure:');
      rows.forEach(row => {
        console.log(`  - ${row.name}: ${row.type} ${row.notnull ? 'NOT NULL' : ''} ${row.dflt_value ? `DEFAULT ${row.dflt_value}` : ''}`);
      });
    }
    
    console.log('✅ Migration completed!');
    db.close();
  });
});
