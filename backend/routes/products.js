import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a product
router.post('/', async (req, res) => {
    const { name, description, price, image, vendorId, category } = req.body;
    if (!name || !description || !price || !image || !vendorId || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const product = new Product({ name, description, price, image, vendorId, category });
        await product.save();
        res.status(201).json({ message: 'Product added', product });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 