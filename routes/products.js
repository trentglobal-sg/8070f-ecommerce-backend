const express = require('express');
const router = express.Router(); // <-- creates a new express router
const productService= require('../services/productService');


// a router stores route
router.get('/', async (req,res)=>{
    const products = await productService.getAllProducts();
    res.json(products)
})

router.get('/:id', async (req,res)=>{
    const product = await productService.getProductById(req.params.id);
    res.json({
        product
    })
})

module.exports = router;