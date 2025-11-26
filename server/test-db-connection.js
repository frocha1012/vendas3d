import pool from './database.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const [rows] = await pool.execute('SELECT 1 as test');
    console.log('✅ Connection successful!');
    
    // Test if tables exist
    try {
      const [items] = await pool.execute('SELECT COUNT(*) as count FROM items');
      console.log(`✅ Items table exists with ${items[0].count} items`);
    } catch (e) {
      console.log('❌ Items table error:', e.message);
      console.log('   Make sure you ran the SQL script in PHPMyAdmin!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testConnection();
