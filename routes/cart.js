const express = require('express');
const router = express.Router();
const cartService = require("../services/cartService");
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT');

router.get('/', AuthenticateWithJWT, async (req,res)=>{
    try {
        const cart = await cartService.getCartContents(req.userId);
        res.json(cart);
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
});

/*
{
  cartItems: [
    {
       product_id: integer,
       quantity: integer
    }
  ]
}
*/
router.put('/', AuthenticateWithJWT, async (req,res)=>{
    try {
        console.log(req.body);
        await cartService.updateCart(req.userId, req.body.cartItems);
        res.json({
            "message":"Cart items have been updated"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: e.message
        })
    }
})

module.exports = router;