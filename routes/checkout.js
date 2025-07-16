const express = require('express');
const router = express.Router();

const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT');
const checkoutService = require('../services/checkoutService');

router.post('/', AuthenticateWithJWT, async function(req,res){
    try {
        const session = await checkoutService.checkout(req.userId);
        res.json(session);

    } catch (e) {
        //console.error(e);
        res.status(500).json({
            'message': "Error checkoing out"
        })
    }
} )

module.exports = router;