require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'game_trading_secret_key_123';

app.use(cors());
app.use(express.json());

// Set up image upload folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', (req, res) => {
  res.send('BUGKOShop API is running');
});

app.get('/api/health', async (req, res) => {
  try {
    console.log(`Connecting to DB at ${process.env.DB_HOST}:${process.env.DB_PORT} as ${process.env.DB_USER}`);
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: error.message });
  }
});

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

const requireSellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Seller or Admin access required' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    const token = jwt.sign({ userId: result.insertId, username, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { id: result.insertId, username, email, role: 'user' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Public Shop Routes
app.get('/api/shop/products', async (req, res) => {
  try {
    const category = req.query.category;
    let query = `
      SELECT a.id, a.game_name, a.category, a.image_url, a.price, a.status, a.created_at, u.username as seller_name
      FROM accounts a
      JOIN users u ON a.seller_id = u.id
      WHERE a.status = 'available'
    `;
    let params = [];

    if (category && category !== 'all') {
      query += ` AND LOWER(REPLACE(a.category, ' ', '-')) = LOWER(?)`;
      params.push(category);
    }
    
    query += ` ORDER BY a.id DESC`;

    const [products] = await pool.execute(query, params);
    res.json(products);
  } catch (error) {
    console.error('Fetch shop products error:', error);
    res.status(500).json({ message: 'Server error fetching shop products' });
  }
});

// Admin User Routes
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, username, email, role, created_at FROM users ORDER BY id ASC');
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

app.put('/api/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  
  if (!role || !['user', 'seller', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role provided' });
  }

  try {
    const [result] = await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error updating role' });
  }
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    // Delete accounts associated with user first to avoid foreign key constraint error
    await pool.execute('DELETE FROM accounts WHERE seller_id = ?', [userId]);
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// Seller Product Routes
app.get('/api/seller/dashboard', authenticateToken, requireSellerOrAdmin, async (req, res) => {
  try {
    const sellerId = req.user.userId;
    
    // Total Sales & Total Orders
    const [orderStats] = await pool.execute(`
      SELECT COUNT(id) as total_orders, COALESCE(SUM(price), 0) as total_sales
      FROM orders
      WHERE seller_id = ? AND status = 'completed'
    `, [sellerId]);

    // Active Products
    const [productStats] = await pool.execute(`
      SELECT COUNT(id) as active_products
      FROM accounts
      WHERE seller_id = ? AND status = 'available'
    `, [sellerId]);

    res.json({
      total_sales: orderStats[0].total_sales,
      total_orders: orderStats[0].total_orders,
      active_products: productStats[0].active_products
    });
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

app.get('/api/seller/products', authenticateToken, requireSellerOrAdmin, async (req, res) => {
  try {
    // Note: Admin gets to see their own products if they sell, but for a real app admins might need a different route to view ALL products.
    const [products] = await pool.execute('SELECT * FROM accounts WHERE seller_id = ? ORDER BY id DESC', [req.user.userId]);
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

app.post('/api/seller/products', authenticateToken, requireSellerOrAdmin, upload.single('image'), async (req, res) => {
  const { game_name, category, account_details, price } = req.body;
  if (!game_name || !account_details || !price || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await pool.execute(
      'INSERT INTO accounts (seller_id, game_name, category, image_url, account_details, price, status) VALUES (?, ?, ?, ?, ?, ?, "available")',
      [req.user.userId, game_name, category, image_url, account_details, price]
    );
    res.status(201).json({ message: 'Product created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

app.put('/api/seller/products/:id', authenticateToken, requireSellerOrAdmin, async (req, res) => {
  const productId = req.params.id;
  const { price, category } = req.body;

  if (!price || !category) {
    return res.status(400).json({ message: 'Price and category are required' });
  }

  try {
    // Ensure the seller owns the product or is an admin
    let query = 'UPDATE accounts SET price = ?, category = ? WHERE id = ? AND seller_id = ?';
    let params = [price, category, productId, req.user.userId];
    
    if (req.user.role === 'admin') {
      query = 'UPDATE accounts SET price = ?, category = ? WHERE id = ?';
      params = [price, category, productId];
    }

    const [result] = await pool.execute(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

app.delete('/api/seller/products/:id', authenticateToken, requireSellerOrAdmin, async (req, res) => {
  const productId = req.params.id;
  try {
    // Ensure the seller owns the product or is an admin
    let query = 'DELETE FROM accounts WHERE id = ? AND seller_id = ?';
    let params = [productId, req.user.userId];

    if (req.user.role === 'admin') {
      query = 'DELETE FROM accounts WHERE id = ?';
      params = [productId];
    }

    const [result] = await pool.execute(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

app.get('/api/seller/products', authenticateToken, requireSellerOrAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM accounts WHERE seller_id = ? ORDER BY id DESC', [req.user.userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// GET Seller Orders
app.get('/api/seller/orders', authenticateToken, requireSellerOrAdmin, async (req, res) => {
  try {
    const query = `
      SELECT o.id, o.price, o.created_at, o.status, a.game_name, u.username as buyer_name
      FROM orders o
      JOIN accounts a ON o.account_id = a.id
      JOIN users u ON o.buyer_id = u.id
      WHERE o.seller_id = ?
      ORDER BY o.id DESC
    `;
    const [orders] = await pool.execute(query, [req.user.userId]);
    res.json(orders);
  } catch (error) {
    console.error('Fetch seller orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// GET Seller Sales (Grouped by date)
app.get('/api/seller/sales', authenticateToken, requireSellerOrAdmin, async (req, res) => {
  try {
    const query = `
      SELECT DATE(created_at) as sale_date, COUNT(id) as total_orders, SUM(price) as total_revenue
      FROM orders
      WHERE seller_id = ? AND status = 'completed'
      GROUP BY DATE(created_at)
      ORDER BY sale_date DESC
      LIMIT 30
    `;
    const [sales] = await pool.execute(query, [req.user.userId]);
    res.json(sales);
  } catch (error) {
    console.error('Fetch seller sales error:', error);
    res.status(500).json({ message: 'Server error fetching sales' });
  }
});

// GET Seller Withdrawals
app.get('/api/seller/withdrawals', authenticateToken, requireSellerOrAdmin, async (req, res) => {
  try {
    const [withdrawals] = await pool.execute(
      'SELECT * FROM withdrawals WHERE user_id = ? ORDER BY id DESC', 
      [req.user.userId]
    );
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching withdrawals' });
  }
});

// POST Seller Withdraw
app.post('/api/seller/withdraw', authenticateToken, requireSellerOrAdmin, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check balance
    const [users] = await connection.execute('SELECT balance FROM users WHERE id = ? FOR UPDATE', [req.user.userId]);
    if (users[0].balance < amount) {
      await connection.rollback();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct balance
    await connection.execute('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, req.user.userId]);

    // Create withdrawal record
    await connection.execute(
      'INSERT INTO withdrawals (user_id, amount, status) VALUES (?, ?, "pending")',
      [req.user.userId, amount]
    );

    await connection.commit();
    res.json({ message: 'Withdrawal requested successfully', newBalance: users[0].balance - amount });
  } catch (error) {
    await connection.rollback();
    console.error('Withdraw error:', error);
    res.status(500).json({ message: 'Server error during withdrawal' });
  } finally {
    connection.release();
  }
});

// --- WALLET APIs ---
app.get('/api/wallet/balance', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT balance FROM users WHERE id = ?', [req.user.userId]);
    res.json({ balance: rows[0].balance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance' });
  }
});

app.post('/api/wallet/topup', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  try {
    await pool.execute('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, req.user.userId]);
    const [rows] = await pool.execute('SELECT balance FROM users WHERE id = ?', [req.user.userId]);
    res.json({ message: 'Top up successful', balance: rows[0].balance });
  } catch (error) {
    res.status(500).json({ message: 'Error topping up' });
  }
});

// --- CART APIs ---
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT c.id as cart_item_id, a.id as account_id, a.game_name, a.price, a.category, a.image_url, u.username as seller_name
      FROM cart_items c
      JOIN accounts a ON c.account_id = a.id
      JOIN users u ON a.seller_id = u.id
      WHERE c.user_id = ? AND a.status = 'available'
    `;
    const [items] = await pool.execute(query, [req.user.userId]);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  const { account_id } = req.body;
  try {
    const [existing] = await pool.execute('SELECT * FROM cart_items WHERE user_id = ? AND account_id = ?', [req.user.userId, account_id]);
    if (existing.length > 0) return res.status(400).json({ message: 'Item already in cart' });
    
    await pool.execute('INSERT INTO cart_items (user_id, account_id) VALUES (?, ?)', [req.user.userId, account_id]);
    res.status(201).json({ message: 'Added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    await pool.execute('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item' });
  }
});

// --- CHECKOUT API ---
app.post('/api/checkout', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get cart items
    const [cartItems] = await connection.execute(`
      SELECT c.id as cart_item_id, a.id as account_id, a.price, a.seller_id, a.status 
      FROM cart_items c JOIN accounts a ON c.account_id = a.id 
      WHERE c.user_id = ? FOR UPDATE
    `, [req.user.userId]);

    if (cartItems.length === 0) throw new Error('Cart is empty');
    
    // 2. Check if all items are still available and calculate total
    let total = 0;
    for (const item of cartItems) {
      if (item.status !== 'available') throw new Error('One or more items are no longer available');
      total += parseFloat(item.price);
    }

    // 3. Check buyer balance
    const [buyers] = await connection.execute('SELECT balance FROM users WHERE id = ? FOR UPDATE', [req.user.userId]);
    if (parseFloat(buyers[0].balance) < total) throw new Error('Insufficient balance');

    // 4. Process transaction
    for (const item of cartItems) {
      // Deduct from buyer
      await connection.execute('UPDATE users SET balance = balance - ? WHERE id = ?', [item.price, req.user.userId]);
      // Add to seller
      await connection.execute('UPDATE users SET balance = balance + ? WHERE id = ?', [item.price, item.seller_id]);
      // Update account status
      await connection.execute('UPDATE accounts SET status = "sold" WHERE id = ?', [item.account_id]);
      // Create order
      await connection.execute(
        'INSERT INTO orders (buyer_id, seller_id, account_id, price) VALUES (?, ?, ?, ?)',
        [req.user.userId, item.seller_id, item.account_id, item.price]
      );
      // Remove from cart
      await connection.execute('DELETE FROM cart_items WHERE id = ?', [item.cart_item_id]);
      // Remove this account from other users' carts
      await connection.execute('DELETE FROM cart_items WHERE account_id = ?', [item.account_id]);
    }

    await connection.commit();
    res.json({ message: 'Checkout successful' });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// --- ORDERS & MY GAMES APIs ---
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT o.id, o.price, o.created_at, o.status, a.game_name, a.image_url, u.username as seller_name
      FROM orders o
      JOIN accounts a ON o.account_id = a.id
      JOIN users u ON o.seller_id = u.id
      WHERE o.buyer_id = ?
      ORDER BY o.id DESC
    `;
    const [orders] = await pool.execute(query, [req.user.userId]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

app.get('/api/my-games', authenticateToken, async (req, res) => {
  try {
    // This is the ONLY place where the buyer gets to see the account_details
    const query = `
      SELECT o.id as order_id, a.game_name, a.account_details, a.image_url, o.created_at
      FROM orders o
      JOIN accounts a ON o.account_id = a.id
      WHERE o.buyer_id = ?
      ORDER BY o.id DESC
    `;
    const [games] = await pool.execute(query, [req.user.userId]);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching my games' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
