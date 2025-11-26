import pool from './database.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing database connection...');
console.log('Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

async function testConnection() {
  try {
    // Test basic connection
    const [rows] = await pool.execute('SELECT 1 as test');
    console.log('✅ Basic connection successful!', rows);

    // Test if database exists and is accessible
    const [dbRows] = await pool.execute('SELECT DATABASE() as current_db');
    console.log('✅ Current database:', dbRows[0].current_db);

    // Check if items table exists
    try {
      const [tableRows] = await pool.execute('SELECT COUNT(*) as count FROM items');
      console.log('✅ Items table exists! Current items:', tableRows[0].count);
    } catch (error) {
      console.log('❌ Items table does not exist or error:', error.message);
      console.log('   You need to run the SQL script in PHPMyAdmin first!');
    }

    // Check if orders table exists
    try {
      const [orderRows] = await pool.execute('SELECT COUNT(*) as count FROM orders');
      console.log('✅ Orders table exists! Current orders:', orderRows[0].count);
    } catch (error) {
      console.log('❌ Orders table does not exist or error:', error.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', error.message);
    console.error('Full error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. This usually means:');
      console.error('   - Wrong database host (localhost might not work for remote Hostinger)');
      console.error('   - Database server is not running');
      console.error('   - Port is blocked');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
      console.error('\n💡 Access denied. Check:');
      console.error('   - Username and password are correct');
      console.error('   - User has permissions to access the database');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist. Make sure the database name is correct.');
    }
    
    process.exit(1);
  }
}

testConnection();
