const express = require('express');
const router = express.Router(); // <-- creates a new express router

// a router stores route
router.get('/', (req,res)=>{
    res.json({
        'message':'Get all the products'
    })
})

router.get('/:id', (req,res)=>{
    res.json({
        'message':`Get product with product id of ${req.params.id}`
    })
})

module.exports = router;