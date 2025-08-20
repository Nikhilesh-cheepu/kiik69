require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Environment Variables Verification');
console.log('=====================================\n');

// Check frontend environment variables (VITE_)
console.log('🌐 Frontend Environment Variables (VITE_):');
console.log('VITE_OPENAI_API_KEY:', process.env.VITE_OPENAI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('VITE_BACKEND_URL:', process.env.VITE_BACKEND_URL ? '✅ Set' : '❌ Missing');
console.log('VITE_OPENAI_MODEL:', process.env.VITE_OPENAI_MODEL ? '✅ Set' : '❌ Missing');
console.log('VITE_OPENAI_MAX_TOKENS:', process.env.VITE_OPENAI_MAX_TOKENS ? '✅ Set' : '❌ Missing');
console.log('VITE_OPENAI_TEMPERATURE:', process.env.VITE_OPENAI_TEMPERATURE ? '✅ Set' : '❌ Missing');
console.log('VITE_OPENAI_TIMEOUT:', process.env.VITE_OPENAI_TIMEOUT ? '✅ Set' : '❌ Missing');

console.log('\n🔧 Backend Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ Missing (defaults to development)');
console.log('PORT:', process.env.PORT || '❌ Missing (defaults to 5000)');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL ? '✅ Set' : '❌ Missing');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing');

console.log('\n📱 Instagram Bot Variables (Optional):');
console.log('INSTAGRAM_ACCESS_TOKEN:', process.env.INSTAGRAM_ACCESS_TOKEN ? '✅ Set' : '❌ Missing (optional)');
console.log('INSTAGRAM_APP_SECRET:', process.env.INSTAGRAM_APP_SECRET ? '✅ Set' : '❌ Missing (optional)');
console.log('INSTAGRAM_VERIFY_TOKEN:', process.env.INSTAGRAM_VERIFY_TOKEN ? '✅ Set' : '❌ Missing (optional)');

// Test database connection if DATABASE_URL is set
const testDatabaseConnection = async () => {
  if (process.env.DATABASE_URL) {
    console.log('\n🗄️ Testing Database Connection...');
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
      const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
      console.log('✅ Database connection successful');
      console.log('   Current time:', result.rows[0].current_time);
      console.log('   Database:', result.rows[0].db_version.split(' ')[0]);
      
      // Check tables
      const tables = await pool.query(`
        SELECT table_name, 
               (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
        FROM information_schema.tables t 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      console.log('\n📋 Database Tables:');
      tables.rows.forEach(table => {
        console.log(`   - ${table.table_name}: ${table.column_count} columns`);
      });
      
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
    } finally {
      await pool.end();
    }
  } else {
    console.log('\n❌ DATABASE_URL not set - cannot test database connection');
  }
};

// Main execution
const main = async () => {
  await testDatabaseConnection();
  
  console.log('\n📝 Summary:');
  console.log('=====================================');

  const requiredFrontend = ['VITE_OPENAI_API_KEY', 'VITE_BACKEND_URL'];
  const requiredBackend = ['DATABASE_URL', 'OPENAI_API_KEY'];

  const missingFrontend = requiredFrontend.filter(key => !process.env[key]);
  const missingBackend = requiredBackend.filter(key => !process.env[key]);

  if (missingFrontend.length === 0) {
    console.log('✅ All required frontend variables are set');
  } else {
    console.log('❌ Missing frontend variables:', missingFrontend.join(', '));
  }

  if (missingBackend.length === 0) {
    console.log('✅ All required backend variables are set');
  } else {
    console.log('❌ Missing backend variables:', missingBackend.join(', '));
  }

  if (missingFrontend.length === 0 && missingBackend.length === 0) {
    console.log('\n🎉 All required environment variables are properly configured!');
  } else {
    console.log('\n⚠️ Please set the missing environment variables before proceeding.');
  }
};

// Run the verification
main().catch(console.error);
