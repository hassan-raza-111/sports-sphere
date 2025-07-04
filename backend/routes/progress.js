import express from 'express';
import Progress from '../models/Progress.js';

const router = express.Router();

// Get progress for a user
router.get('/', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'Missing userId' });
    try {
        const progress = await Progress.find({ userId }).sort({ date: 1 });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add progress
router.post('/', async (req, res) => {
    const { userId, metrics } = req.body;
    if (!userId || !metrics) return res.status(400).json({ message: 'Missing required fields' });
    try {
        const progress = new Progress({ userId, metrics });
        await progress.save();
        res.status(201).json({ message: 'Progress added', progress });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 