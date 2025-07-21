
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
process.env.NODE_ENV = 'test';

// Test database configuration
const testDbConfig = {
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME
};

// Suppress unhandled promise rejections and warnings
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection (suppressed):', reason);
});
process.on('warning', (warning) => {
  // Print the warning but do not crash
  console.warn('Node warning (suppressed):', warning.name, warning.message);
});

// Global setup - runs once before all tests
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';

  // Override database config for tests
  process.env.DB_HOST = testDbConfig.host;
  process.env.DB_USER = testDbConfig.user;
  process.env.DB_PASSWORD = testDbConfig.password;
  process.env.DB_NAME = testDbConfig.database;

  // drop test database
  await dropTestDatabase();

  // Create test database if it doesn't exist
  await createTestDatabase();

  // Setup schema and base data
  await setupTestDatabase();
}, 30000); // 30 second timeout for database setup

// Global teardown - runs once after all tests
afterAll(async () => {
  // Close any remaining connections
  const pool = require('../database');
  await pool.end();
});

async function createTestDatabase() {
  let adminConnection;
  try {
    adminConnection = await mysql.createConnection({
      host: testDbConfig.host,
      user: testDbConfig.user,
      password: testDbConfig.password
    });
  } catch (error) {
    console.error('Error creating test database:', error);
    throw error;
  }


  try {
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS ${testDbConfig.database}`);
  } finally {
    await adminConnection.end();
  }
}

async function setupTestDatabase() {
  const connection = await mysql.createConnection(testDbConfig);

  try {
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');

    // Split schema into individual statements and execute
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('USE'));

    for (const statement of statements) {
      if (statement) {
        await connection.query(statement);
      }
    }

    // Insert base test data
    await insertBaseTestData(connection);
  } finally {
    await connection.end();
  }
}

async function insertBaseTestData(connection) {
  // Insert marketing preferences (required for user tests)
  const marketingPrefs = [
    'email_newsletter',
    'sms_promotions',
    'product_updates',
    'special_offers'
  ];

  for (const pref of marketingPrefs) {
    await connection.query(
      'INSERT IGNORE INTO marketing_preferences (preference) VALUES (?)',
      [pref]
    );
  }

  // Insert test products for product tests
  const testProducts = [
    { name: 'Test Product 1', price: 29.99, image: 'test1.jpg' },
    { name: 'Test Product 2', price: 49.99, image: 'test2.jpg' },
    { name: 'Test Product 3', price: 19.99, image: 'test3.jpg' }
  ];

  for (const product of testProducts) {
    await connection.query(
      'INSERT INTO products (name, price, image) VALUES (?, ?, ?)',
      [product.name, product.price, product.image]
    );
  }
}

async function dropTestDatabase() {
  let adminConnection;
  try {
    adminConnection = await mysql.createConnection({
      host: testDbConfig.host,
      user: testDbConfig.user,
      password: testDbConfig.password
    });
  } catch (error) {
    console.error('Error creating test database:', error);
    throw error;
  }

  try {
    await adminConnection.query(`DROP DATABASE IF EXISTS ${testDbConfig.database}`);
  } finally {
    await adminConnection.end();
  }
}