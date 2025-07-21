const { getAllProducts, getProductById } = require('../../data/productData');
const { cleanTestData } = require('../utils/dbUtils');


describe('productData.js', () => {
  beforeEach(async () => {
    await cleanTestData();
  });

  it('getAllProducts returns all products', async () => {
    const products = await getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
    expect(products[0]).toHaveProperty('image');
  });

  it('getProductById returns a product by valid ID', async () => {
    const products = await getAllProducts();
    const product = await getProductById(products[0].id);
    expect(product).toBeDefined();
    expect(product.id).toBe(products[0].id);
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('image');
  });
});

