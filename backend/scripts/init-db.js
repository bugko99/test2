const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

async function initDB() {
  let connection;
  try {
    console.log('Connecting to MySQL Server...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true // Essential for executing full SQL scripts
    });

    console.log('Reading 01-schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../../db/init/01-schema.sql'), 'utf8');
    
    console.log('Executing Schema Script...');
    await connection.query(schemaSql);

    console.log('Reading 02-seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, '../../db/init/02-seed.sql'), 'utf8');
    
    console.log('Executing Seed Script...');
    await connection.query(seedSql);

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error during database initialization:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDB();
