import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
    const { email, fullName, address, city, zip, cardNumber, expiry, cvv, paymentMethod, selectedBank } = req.body;
    if (!email || !fullName || !address || !city || !zip || !cardNumber || !expiry || !cvv || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const order = new Order({ email, fullName, address, city, zip, cardNumber, expiry, cvv, paymentMethod, selectedBank });
        await order.save();
        res.status(201).json({ message: 'Order placed', order });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get total revenue
router.get('/revenue', async (req, res) => {
    try {
        const orders = await Order.find();
        // Try to sum 'total', fallback to 0 if not present
        const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        res.json({ revenue });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 