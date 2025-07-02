const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT');


router.post('/register', async (req, res) => {
    try {

        const newUserId = await userService.registerUser(req.body);
        res.json({
            "message": "New user has been registered",
            "userId": newUserId
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({
            'message': 'Unable to register user',
            'error': e
        })
    }
})

router.post('/login', async (req, res)=>{
    try {

        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        const token = jwt.sign({
            'userId': user.id
        }, process.env.JWT_SECRET,
            {
                'expiresIn': "1h"
            })
        res.json({
            message:"Login successful",
            token
        })

    } catch (e) {
        res.status(400).json({
            error: e,
            message: "Login unsuccessful"
        })
    }
})

router.put('/me', AuthenticateWithJWT, async(req,res)=>{
    const userId = req.userId;
    const userDetails = req.body;
    try {
        await userService.updateUserDetails(userId, userDetails);
        res.json({
            'message':'User Updated'
        })
    
    } catch (e) {
        res.status(400).json({
            error: e,
            message: "Failed to update user profile"
        })
    }
})

router.get('/me', AuthenticateWithJWT, async(req,res)=>{
    try {
        const user = await userService.getUserDetailsById(req.userId)
      
        if (!user) {
            res.status(401).json({
                "error":"Unable to find user"
            })
        }
        res.json({
            user
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            'message':"Unable to get profile",
            'error': e
        })
    }
})

router.delete('/me', AuthenticateWithJWT, async(req,res)=>{
    try {
        await userService.deleteUserById(req.userId);
        res.json({
            'message':'User has been deleted'
        })

    } catch (e) {
        res.status(400).json({
            'error': e,
            'message': 'Unable to delete user'
        })
    }
})

module.exports = router;