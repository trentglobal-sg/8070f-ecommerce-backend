
const pool = require('../database');

async function getOrdersByUserId(userId) {
    const [rows] = await pool.query(`SELECT * FROM orders WHERE user_id = ?`, [userId]);
    return rows;
}

async function createOrder(userId, orderItems) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // calculate thte total of all the items the user is buying
        let total = 0;
        for (let o of orderItems) {
            total += o.price * o.quantity;
        }

        // create order in the orders table
        const [orderResult] = await connection.query(`
                INSERT INTO orders(user_id, total) VALUES (?, ?)
            `, [userId, total]);
        const orderId = orderResult.insertId;

        // for each order item, insert them as rows into the order_items table
        for (const item of orderItems) {
            await connection.query(`
                INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)
            `, [orderId, item.product_id, item.quantity])
        }

        await connection.commit();
        return orderId;

    } catch (e) {
        console.error(e);
        await connection.rollback();
    } finally {
        await connection.release();
    }


}

async function getOrderDetails(orderId) {
    const [rows] = await pool.query(`
            SELECT 
                order_items.product_id,
                products.name,
                products.price,
                products.image,
                order_items.quantity
            FROM
                order_items JOIN products
                ON order_items.product_id = products.id
            WHERE order_id = ?
        `, [orderId]);
    return rows;
}

async function updateOrderStatus(orderId, status) {
    // validate status before updatingOr
    if (!['created', 'processing', 'completed', 'cancelled'].includes(status)) {
        throw new Error('Invalid status');
    }
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
}

async function updateOrderSessionId(orderId, sessionId) {
    await pool.query('UPDATE orders SET checkout_session_id = ? WHERE id = ?', [sessionId, orderId]);
}

module.exports = {
    getOrdersByUserId,
    createOrder,
    getOrderDetails,
    updateOrderStatus,
    updateOrderSessionId
}