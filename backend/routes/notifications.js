import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get notifications for an athlete
router.get('/athlete/:id', async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.params.id,
      recipientType: 'athlete',
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Create a new notification
router.post('/', async (req, res) => {
  const { recipient, recipientType, message, type } = req.body;

  if (!recipient || !recipientType || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const notification = new Notification({
      recipient,
      recipientType,
      message,
      type: type || 'general',
      read: false,
    });

    await notification.save();
    res.status(201).json({ message: 'Notification created', notification });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread notifications count
router.get('/athlete/:id/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.params.id,
      recipientType: 'athlete',
      read: false,
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

export default router;
