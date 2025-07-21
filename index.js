const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());

const stripeRouter = require('./routes/stripe')
const productRouter = require('./routes/products');
const userRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

// make sure sure to register the router for the webhook
// BEFORE app.use(express.json)
app.use('/stripe', stripeRouter)

// Middleware for non-webhook routes
app.use(express.json());

// register the router
app.use('/api/products', productRouter); // If the URL begins with /products, the rest
                                     // of the URL will be checked in productsRouter
app.use('/api/users', userRouter)
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});