import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const configs = [
  {
    name: 'Current .env config (localhost)',
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  },
  {
    name: 'Domain name (k1zz.space)',
    host: 'k1zz.space',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  },
  {
    name: 'MySQL subdomain (mysql.k1zz.space)',
    host: 'mysql.k1zz.space',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  },
  {
    name: 'Common Hostinger MySQL host',
    host: 'mysql.hostinger.com',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  },
  {
    name: 'IP-based MySQL host',
    host: '185.224.137.3', // Common Hostinger IP pattern
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  }
];

async function testConnection(config) {
  try {
    console.log(`\nTesting: ${config.name}`);
    console.log(`  Host: ${config.host}`);
    console.log(`  User: ${config.user}`);
    console.log(`  Database: ${config.database}`);
    
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port,
      connectTimeout: 5000,
    });
    
    const [rows] = await connection.execute('SELECT 1 as test, DATABASE() as db');
    console.log(`  ✅ SUCCESS! Connected to: ${rows[0].db}`);
    
    // Test tables
    try {
      const [items] = await connection.execute('SELECT COUNT(*) as count FROM items');
      console.log(`  ✅ Items table exists (${items[0].count} items)`);
    } catch (e) {
      console.log(`  ⚠️  Items table missing: ${e.message}`);
    }
    
    try {
      const [orders] = await connection.execute('SELECT COUNT(*) as count FROM orders');
      console.log(`  ✅ Orders table exists (${orders[0].count} orders)`);
    } catch (e) {
      console.log(`  ⚠️  Orders table missing: ${e.message}`);
    }
    
    await connection.end();
    return true;
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.code || error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.log(`     → Connection refused. Host might be wrong or remote access blocked.`);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log(`     → Access denied. Check username/password.`);
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log(`     → Database doesn't exist.`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`     → Connection timeout. Host might be wrong or firewall blocking.`);
    }
    return false;
  }
}

async function runTests() {
  console.log('=== Hostinger MySQL Connection Tester ===\n');
  
  for (const config of configs) {
    const success = await testConnection(config);
    if (success) {
      console.log(`\n✅ Working configuration found!`);
      console.log(`\nUpdate your .env file with:`);
      console.log(`DB_HOST=${config.host}`);
      process.exit(0);
    }
  }
  
  console.log(`\n❌ None of the configurations worked.`);
  console.log(`\n💡 Next steps:`);
  console.log(`1. Check your Hostinger hPanel > Databases > MySQL Databases`);
  console.log(`2. Look for "MySQL Host" - it might be your domain or a specific hostname`);
  console.log(`3. You may need to enable "Remote MySQL" access in Hostinger`);
  console.log(`4. Or deploy your app to Hostinger's server to use localhost`);
  process.exit(1);
}

runTests();
