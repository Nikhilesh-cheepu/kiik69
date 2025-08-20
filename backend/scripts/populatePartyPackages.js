const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Sample party packages data
const partyPackages = [
  {
    name: "Power Play",
    description: "Perfect for small groups and casual gatherings",
    price: 2999,
    features: [
      "2 hours of gaming",
      "Unlimited soft drinks",
      "Snacks platter",
      "Basic sound system",
      "Up to 8 people"
    ],
    image_url: "/images/packages/power-play.jpg",
    is_active: true
  },
  {
    name: "Game Changer",
    description: "Ideal for medium-sized parties with enhanced gaming experience",
    price: 5999,
    features: [
      "4 hours of premium gaming",
      "Unlimited beverages (soft drinks + mocktails)",
      "Deluxe snacks & starters",
      "Premium sound system",
      "Gaming tournament setup",
      "Up to 15 people"
    ],
    image_url: "/images/packages/game-changer.jpg",
    is_active: true
  },
  {
    name: "World Cup Edition",
    description: "Ultimate sports bar experience for large groups",
    price: 9999,
    features: [
      "6 hours of unlimited gaming",
      "All-inclusive food & beverages",
      "Premium sound & lighting system",
      "Multiple gaming zones",
      "Dedicated host",
      "Photo booth",
      "Up to 25 people"
    ],
    image_url: "/images/packages/world-cup.jpg",
    is_active: true
  },
  {
    name: "VIP Experience",
    description: "Luxury package with exclusive amenities",
    price: 14999,
    features: [
      "8 hours of premium gaming",
      "Gourmet food & premium drinks",
      "Private gaming lounge",
      "Professional DJ setup",
      "Custom decorations",
      "Dedicated staff",
      "Up to 30 people"
    ],
    image_url: "/images/packages/vip-experience.jpg",
    is_active: true
  }
];

// Populate party packages
const populatePartyPackages = async () => {
  try {
    console.log('🔄 Starting party packages population...');
    
    // Clear existing data
    await pool.query('DELETE FROM party_packages');
    console.log('✅ Cleared existing party packages');
    
    // Insert new data
    for (const pkg of partyPackages) {
      const result = await pool.query(
        'INSERT INTO party_packages (name, description, price, features, image_url, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [pkg.name, pkg.description, pkg.price, pkg.features, pkg.image_url, pkg.is_active]
      );
      console.log(`✅ Added package: ${pkg.name} (ID: ${result.rows[0].id})`);
    }
    
    console.log('🎉 Party packages population completed successfully!');
    
    // Verify data
    const count = await pool.query('SELECT COUNT(*) FROM party_packages');
    console.log(`📊 Total packages in database: ${count.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error populating party packages:', error);
  } finally {
    await pool.end();
  }
};

// Run the script
populatePartyPackages();
