const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Updated party packages data for KIIK 69
const partyPackages = [
  {
    name: "Power Play",
    description: "Perfect for small groups and casual gaming sessions",
    price: 2999,
    features: [
      "2 hours of unlimited gaming",
      "Unlimited soft drinks & mocktails",
      "Deluxe snacks platter (Crispy Corn, Paneer Tikka, French Fries)",
      "Basic sound system & LED lighting",
      "Access to 2 gaming consoles",
      "Up to 8 people",
      "Free WiFi"
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
      "Unlimited beverages (soft drinks + mocktails + energy drinks)",
      "Deluxe snacks & starters (Chicken Wings, Spring Rolls, Nachos)",
      "Premium sound system with DJ setup",
      "Gaming tournament setup with prizes",
      "Access to 4 gaming consoles + 2 PCs",
      "Up to 15 people",
      "Free WiFi + Photo booth access"
    ],
    image_url: "/images/packages/game-changer.jpg",
    is_active: true
  },
  {
    name: "World Cup Edition",
    description: "Ultimate sports bar experience for large groups and celebrations",
    price: 9999,
    features: [
      "6 hours of unlimited gaming & entertainment",
      "All-inclusive food & beverages (including alcoholic options)",
      "Premium sound & lighting system with disco effects",
      "Multiple gaming zones (consoles, PCs, VR setup)",
      "Dedicated party host & DJ",
      "Photo booth with props",
      "Custom decorations & balloons",
      "Up to 25 people",
      "Free WiFi + Parking assistance"
    ],
    image_url: "/images/packages/world-cup.jpg",
    is_active: true
  },
  {
    name: "VIP Experience",
    description: "Luxury package with exclusive amenities and premium service",
    price: 14999,
    features: [
      "8 hours of premium gaming & entertainment",
      "Gourmet food & premium drinks (full bar access)",
      "Private gaming lounge with exclusive access",
      "Professional DJ setup with custom playlist",
      "Custom decorations & theme setup",
      "Dedicated staff (host, server, security)",
      "VIP parking & valet service",
      "Up to 30 people",
      "Free WiFi + Premium seating + Exclusive gaming titles"
    ],
    image_url: "/images/packages/vip-experience.jpg",
    is_active: true
  },
  {
    name: "Student Special",
    description: "Affordable gaming package for students and young groups",
    price: 1999,
    features: [
      "3 hours of gaming fun",
      "Unlimited soft drinks",
      "Basic snacks (Popcorn, Chips, Cookies)",
      "Access to 2 gaming consoles",
      "Student ID required",
      "Up to 6 people",
      "Free WiFi"
    ],
    image_url: "/images/packages/student-special.jpg",
    is_active: true
  },
  {
    name: "Corporate Package",
    description: "Professional setup for corporate events and team building",
    price: 12999,
    features: [
      "6 hours of corporate gaming & networking",
      "Professional catering with vegetarian options",
      "Corporate presentation setup (projector, screen)",
      "Team building activities & tournaments",
      "Professional sound system for presentations",
      "Dedicated event coordinator",
      "Corporate branding options",
      "Up to 40 people",
      "Free WiFi + Business center access"
    ],
    image_url: "/images/packages/corporate.jpg",
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
      console.log(`✅ Added package: ${pkg.name} (ID: ${result.rows[0].id}) - ₹${pkg.price}`);
    }
    
    console.log('🎉 Party packages population completed successfully!');
    
    // Verify data
    const count = await pool.query('SELECT COUNT(*) FROM party_packages');
    console.log(`📊 Total packages in database: ${count.rows[0].count}`);
    
    // Show all packages
    const allPackages = await pool.query('SELECT name, price, is_active FROM party_packages ORDER BY price');
    console.log('\n📋 All packages:');
    allPackages.rows.forEach(pkg => {
      console.log(`  - ${pkg.name}: ₹${pkg.price} (${pkg.is_active ? 'Active' : 'Inactive'})`);
    });
    
  } catch (error) {
    console.error('❌ Error populating party packages:', error);
  } finally {
    await pool.end();
  }
};

// Run the script
populatePartyPackages().catch(console.error);
