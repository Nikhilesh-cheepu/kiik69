require('dotenv').config();
const { Pool } = require('pg');

console.log('🚀 KIIK 69 Database Setup Script');
console.log('==================================\n');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Step 1: Clean up database (remove unnecessary tables)
const cleanupDatabase = async () => {
  console.log('🔄 Step 1: Cleaning up database...');
  
  try {
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
    
    console.log('✅ Database cleanup completed!\n');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    throw error;
  }
};

// Step 2: Ensure required tables exist with correct schema
const ensureTablesExist = async () => {
  console.log('🔄 Step 2: Ensuring required tables exist...');
  
  try {
    // Create chat_users table
    await pool.query(`
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
    console.log('✅ chat_users table ready');

    // Create user_chats table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_chats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES chat_users(id),
        session_id TEXT NOT NULL,
        message TEXT NOT NULL,
        is_bot BOOLEAN DEFAULT false,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ user_chats table ready');

    // Create party_packages table
    await pool.query(`
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
    console.log('✅ party_packages table ready');

    console.log('✅ All required tables are ready!\n');
    
  } catch (error) {
    console.error('❌ Table creation failed:', error);
    throw error;
  }
};

// Step 3: Populate party packages
const populatePartyPackages = async () => {
  console.log('🔄 Step 3: Populating party packages...');
  
  try {
    // Updated party packages data for KIIK 69
    const partyPackages = [
      {
        name: "Power Play",
        description: "Perfect for small groups and casual gaming sessions",
        price: 2999,
        includes: "2 hours of unlimited gaming, Unlimited soft drinks & mocktails, Deluxe snacks platter (Crispy Corn, Paneer Tikka, French Fries), Basic sound system & LED lighting, Access to 2 gaming consoles, Up to 8 people, Free WiFi",
        image_url: "/images/packages/power-play.jpg",
        is_available: true
      },
      {
        name: "Game Changer",
        description: "Ideal for medium-sized parties with enhanced gaming experience",
        price: 5999,
        includes: "4 hours of premium gaming, Unlimited beverages (soft drinks + mocktails + energy drinks), Deluxe snacks & starters (Chicken Wings, Spring Rolls, Nachos), Premium sound system with DJ setup, Gaming tournament setup with prizes, Access to 4 gaming consoles + 2 PCs, Up to 15 people, Free WiFi + Photo booth access",
        image_url: "/images/packages/game-changer.jpg",
        is_available: true
      },
      {
        name: "World Cup Edition",
        description: "Ultimate sports bar experience for large groups and celebrations",
        price: 9999,
        includes: "6 hours of unlimited gaming & entertainment, All-inclusive food & beverages (including alcoholic options), Premium sound & lighting system with disco effects, Multiple gaming zones (consoles, PCs, VR setup), Dedicated party host & DJ, Photo booth with props, Custom decorations & balloons, Up to 25 people, Free WiFi + Parking assistance",
        image_url: "/images/packages/world-cup.jpg",
        is_available: true
      },
      {
        name: "VIP Experience",
        description: "Luxury package with exclusive amenities and premium service",
        price: 14999,
        includes: "8 hours of premium gaming & entertainment, Gourmet food & premium drinks (full bar access), Private gaming lounge with exclusive access, Professional DJ setup with custom playlist, Custom decorations & theme setup, Dedicated staff (host, server, security), VIP parking & valet service, Up to 30 people, Free WiFi + Premium seating + Exclusive gaming titles",
        image_url: "/images/packages/vip-experience.jpg",
        is_available: true
      },
      {
        name: "Student Special",
        description: "Affordable gaming package for students and young groups",
        price: 1999,
        includes: "3 hours of gaming fun, Unlimited soft drinks, Basic snacks (Popcorn, Chips, Cookies), Access to 2 gaming consoles, Student ID required, Up to 6 people, Free WiFi",
        image_url: "/images/packages/student-special.jpg",
        is_available: true
      },
      {
        name: "Corporate Package",
        description: "Professional setup for corporate events and team building",
        price: 12999,
        includes: "6 hours of corporate gaming & networking, Professional catering with vegetarian options, Corporate presentation setup (projector, screen), Team building activities & tournaments, Professional sound system for presentations, Dedicated event coordinator, Corporate branding options, Up to 40 people, Free WiFi + Business center access",
        image_url: "/images/packages/corporate.jpg",
        is_available: true
      }
    ];

    // Clear existing data
    await pool.query('DELETE FROM party_packages');
    console.log('✅ Cleared existing party packages');
    
    // Insert new data
    for (const pkg of partyPackages) {
      const result = await pool.query(
        'INSERT INTO party_packages (name, description, price, includes, image_url, is_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [pkg.name, pkg.description, pkg.price, pkg.includes, pkg.image_url, pkg.is_available]
      );
      console.log(`✅ Added package: ${pkg.name} (ID: ${result.rows[0].id}) - ₹${pkg.price}`);
    }
    
    console.log('✅ Party packages population completed!\n');
    
  } catch (error) {
    console.error('❌ Error populating party packages:', error);
    throw error;
  }
};

// Step 4: Verify final database state
const verifyDatabase = async () => {
  console.log('🔄 Step 4: Verifying database state...');
  
  try {
    // Check all tables
    const tables = await pool.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Final Database Tables:');
    tables.rows.forEach(table => {
      console.log(`   - ${table.table_name}: ${table.column_count} columns`);
    });
    
    // Check party packages count
    const packageCount = await pool.query('SELECT COUNT(*) FROM party_packages');
    console.log(`\n🎉 Party Packages: ${packageCount.rows[0].count} packages loaded`);
    
    // Show all packages
    const allPackages = await pool.query('SELECT name, price, is_available FROM party_packages ORDER BY price');
    console.log('\n📋 All packages:');
    allPackages.rows.forEach(pkg => {
      console.log(`   - ${pkg.name}: ₹${pkg.price} (${pkg.is_available ? 'Available' : 'Unavailable'})`);
    });
    
    console.log('\n✅ Database verification completed!\n');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await cleanupDatabase();
    await ensureTablesExist();
    await populatePartyPackages();
    await verifyDatabase();
    
    console.log('🎉 Database setup completed successfully!');
    console.log('🚀 Your KIIK 69 backend is ready for production!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run the setup
main().catch(console.error);
