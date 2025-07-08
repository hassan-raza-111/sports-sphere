import express from 'express';
import Feedback from '../models/Feedback.js';
import Product from '../models/Product.js';

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

// Get all feedback for an athlete
router.get('/athlete/:id', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ athlete: req.params.id })
      .sort({ date: -1 })
      .populate('coach', 'name');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get all feedback (for testimonials)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      rating: { $gte: 4 },
      feedbackText: { $ne: '' },
    })
      .sort({ date: -1 })
      .limit(10);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Get all feedback for a vendor's products
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    // Find all products for this vendor
    const products = await Product.find({ vendorId });
    const productIds = products.map((p) => p._id);
    // Find all feedback for these products
    const feedbacks = await Feedback.find({ productId: { $in: productIds } })
      .populate('userId', 'name email')
      .populate('productId', 'name');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
});

// Vendor reply to feedback
router.put('/:feedbackId/reply', async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: 'Reply is required' });
    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { reply, repliedAt: new Date() },
      { new: true }
    );
    if (!feedback)
      return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Reply added', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add reply' });
  }
});

export default router;
