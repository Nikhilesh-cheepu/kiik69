require('dotenv').config();
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local') });
const path = require('path');
const { pathToFileURL } = require('url');
const { Pool } = require('pg');
const connectionString = require('../config/connectionString');

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const populateMenuItems = async () => {
  try {
    // Dynamic import for ESM module
    const menuPath = pathToFileURL(path.resolve(__dirname, '../../src/data/menuData.js')).href;
    const { menuData } = await import(menuPath);

    console.log('🔄 Populating menu items...');

    // Clear existing data
    await pool.query('DELETE FROM menu_items');
    console.log('✅ Cleared existing menu items');

    let count = 0;

    // Insert food items
    for (const item of menuData.food.items) {
      await pool.query(
        `INSERT INTO menu_items (name, price, category, description, image, menu_type, is_available)
         VALUES ($1, $2, $3, $4, $5, 'food', true)`,
        [item.name, item.price, item.category, item.description || null, item.image || null]
      );
      count++;
    }
    console.log(`✅ Added ${menuData.food.items.length} food items`);

    // Insert liquor items
    for (const item of menuData.liquor.items) {
      await pool.query(
        `INSERT INTO menu_items (name, price, category, description, image, menu_type, is_available)
         VALUES ($1, $2, $3, $4, $5, 'liquor', true)`,
        [item.name, item.price, item.category, item.description || null, item.image || null]
      );
      count++;
    }
    console.log(`✅ Added ${menuData.liquor.items.length} liquor items`);

    console.log(`\n🎉 Menu items population complete! Total: ${count} items`);

    const totalResult = await pool.query('SELECT COUNT(*) FROM menu_items');
    console.log(`📊 Database now has ${totalResult.rows[0].count} menu items`);

  } catch (error) {
    console.error('❌ Error populating menu items:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

populateMenuItems();
