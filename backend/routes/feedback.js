import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Create new feedback
router.post('/', async (req, res) => {
    const { feedbackType, selectedCoach, rating, feedbackText, email } = req.body;
    if (!feedbackType || !rating || !feedbackText) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const feedback = new Feedback({ feedbackType, selectedCoach, rating, feedbackText, email });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted', feedback });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 