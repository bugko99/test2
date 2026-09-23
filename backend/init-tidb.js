require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function initDB() {
  console.log('Connecting to TiDB...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

  console.log('Connected! Creating tables for BUGKOshop...');

  try {
    // Drop existing tables to ensure clean state
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('DROP TABLE IF EXISTS cart_items, orders, withdrawals, accounts, users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'seller', 'admin') DEFAULT 'user',
        balance DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created users table');

    await connection.query(`
      CREATE TABLE accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        game_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url VARCHAR(255),
        account_details TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        status ENUM('available', 'sold') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id)
      )
    `);
    console.log('Created accounts table');

    await connection.query(`
      CREATE TABLE cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        account_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      )
    `);
    console.log('Created cart_items table');

    await connection.query(`
      CREATE TABLE orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        buyer_id INT NOT NULL,
        seller_id INT NOT NULL,
        account_id INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        status ENUM('completed', 'refunded') DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES users(id),
        FOREIGN KEY (seller_id) REFERENCES users(id),
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      )
    `);
    console.log('Created orders table');

    await connection.query(`
      CREATE TABLE withdrawals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Created withdrawals table');
    
    // Seed an admin user
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('123456', 10);
    await connection.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ('admin', 'admin@bugkoshop.com', ?, 'admin')",
      [hash]
    );
    console.log('Created Admin User: admin / 123456');

    console.log('Database initialized successfully! 🎉');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

initDB();
