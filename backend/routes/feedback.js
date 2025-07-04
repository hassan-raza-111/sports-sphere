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
    const feedback = new Feedback({
      feedbackType,
      selectedCoach,
      rating,
      feedbackText,
      email,
    });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get average rating for an athlete
router.get('/athlete/:id/average-rating', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ athlete: req.params.id });
    if (!feedbacks.length) return res.json({ averageRating: 0 });
    const sum = feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0);
    const avg = sum / feedbacks.length;
    res.json({ averageRating: avg });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch average rating' });
  }
});

export default router;
