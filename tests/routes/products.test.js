const request = require('supertest');
const express = require('express');
const productRouter = require('../../routes/products');
const { cleanTestData } = require('../utils/dbUtils');

// Minimal Express app for testing only the products route
const app = express();
app.use(express.json());
app.use('/api/products', productRouter);

beforeEach(async () => {
  await cleanTestData();
});

describe('GET /api/products', () => {
  it('should return a list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
    expect(res.body[0]).toHaveProperty('image');
  });
});
