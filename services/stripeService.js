const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Contract
// orderItems : [{product_id, quantity}]
function createLineItems(orderItems) {
    const lineItems = [];
    for (let item of orderItems) {
        // the keys in this lineItem object is predefined by the Stripe API
        // we cannot put our own keys here
        const lineItem = {
            'price_data': {
                'currency': 'sgd',
                'product_data': {
                    name: item.product_name,
                    images: [item.image_url || "https://placehold.co/400"],
                    metadata: {
                        product_id: item.product_id
                    }
                },
                'unit_amount': Math.round(item.price * 100)
            },
            'quantity': item.quantity
        }
        lineItems.push(lineItem)
    }
    console.log("line items");
   console.log(lineItems[0].price_data.product_data);
    return lineItems;
}

async function createCheckoutSession(userId, orderItems, orderId) {
    // 1. create the line items
    const lineItems = createLineItems(orderItems);
    // 2. send the line items to Stripe and create a session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: "payment",
        success_url: "https://www.google.com",
        cancel_url: "https://www.yahoo.com",
        metadata: {
            'userId': userId,
            'orderId': orderId
        }
    })

    // 3. return the session id
    return session;
}

module.exports = {
    createCheckoutSession
}