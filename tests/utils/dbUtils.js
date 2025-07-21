const pool = require('../../database');

// Clean all user-generated data while preserving base data
async function cleanTestData() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Order matters due to foreign key constraints
    await connection.query('DELETE FROM order_items');
    await connection.query('DELETE FROM orders');
    await connection.query('DELETE FROM cart_items');
    await connection.query('DELETE FROM user_marketing_preferences');
    await connection.query('DELETE FROM users');
    
    // Don't delete products and marketing_preferences as they're base test data
    
    // Reset auto-increment counters for predictable IDs
    await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE orders AUTO_INCREMENT = 1');
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get current product count for testing
async function getProductCount() {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
  return rows[0].count;
}

// Insert additional test products if needed
async function insertTestProduct(productData) {
  const { name, price, image } = productData;
  const [result] = await pool.query(
    'INSERT INTO products (name, price, image) VALUES (?, ?, ?)',
    [name, price, image]
  );
  return result.insertId;
}

// Create test user and return ID
async function createTestUser(userData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, salutation, country) VALUES (?, ?, ?, ?, ?)',
      [userData.name, userData.email, userData.password, userData.salutation, userData.country]
    );
    
    const userId = result.insertId;
    
    // Add marketing preferences if provided
    if (userData.marketingPreferences) {
      for (const pref of userData.marketingPreferences) {
        const [prefResult] = await connection.query(
          'SELECT id FROM marketing_preferences WHERE preference = ?',
          [pref]
        );
        
        if (prefResult.length > 0) {
          await connection.query(
            'INSERT INTO user_marketing_preferences (user_id, preference_id) VALUES (?, ?)',
            [userId, prefResult[0].id]
          );
        }
      }
    }
    
    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { 
  cleanTestData, 
  getProductCount, 
  insertTestProduct, 
  createTestUser 
};
