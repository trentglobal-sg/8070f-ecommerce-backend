const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// important: the request payload for the Stripe webhook
// cannot be processed by the express.json() middleware
router.post('/webhook',
    express.raw({type:'application/json'}),
    async function (req,res){
        let event; // contain the data that Stripe is sending us
        try {

            // 1. make sure the reques is actually from stripe
            // extract the headers where is the signature contained
            const sig = req.headers['stripe-signature'];
            
            // the function will reconstruct the data that stripe
            // is sending us
            // first argument: the data that stripe is sending
            // second argumnet: the signature in the headers
            // third arugment: the signing secret for the webhook
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );

        } catch (e) {
            console.error(e);
            // send an error message to Stripe if processing the 
            // event fails
            res.status(500).json({
                'error': e
            })
            return;
        }

        // no error, the event is reconstructed correctly
        if (event.type == "checkout.session.completed") {
            const session = event.data.object
            console.log("event =", event);
            console.log("session =", session);
            if (session.metadata && session.metadata.orderId) {
                await orderService.updateOrderStatus(session.metadata.orderId, "processing");
            }   
        }

        // tell stripe everything is ok
        res.sendStatus(200);
    }

)

module.exports= router;