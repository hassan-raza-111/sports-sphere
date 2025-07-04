import express from 'express';
import Coach from '../models/Coach.js';

const router = express.Router();

// Get all coaches
router.get('/', async (req, res) => {
    try {
        const coaches = await Coach.find();
        res.json(coaches);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a coach
router.post('/', async (req, res) => {
    const { name, specialty, rating, reviews, bio, image } = req.body;
    if (!name || !specialty || !rating || !reviews || !bio || !image) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const coach = new Coach({ name, specialty, rating, reviews, bio, image });
        await coach.save();
        res.status(201).json({ message: 'Coach added', coach });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 