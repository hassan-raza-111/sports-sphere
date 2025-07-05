import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
  const { coach, athlete, date, time, notes } = req.body;
  if (!coach || !athlete || !date || !time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const booking = new Booking({ coach, athlete, date, time, notes });
    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get upcoming bookings count for an athlete
router.get('/athlete/:id/bookings/upcoming', async (req, res) => {
  try {
    const count = await Booking.countDocuments({
      athlete: req.params.id,
      date: { $gte: new Date().toISOString().split('T')[0] },
      status: { $ne: 'cancelled' },
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch upcoming bookings count' });
  }
});

// Get completed sessions count for an athlete
router.get('/athlete/:id/bookings/completed', async (req, res) => {
  try {
    const count = await Booking.countDocuments({
      athlete: req.params.id,
      status: 'completed',
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch completed sessions count' });
  }
});

// Get current bookings count for an athlete
router.get('/athlete/:id/bookings/current', async (req, res) => {
  try {
    const count = await Booking.countDocuments({
      athlete: req.params.id,
      date: { $gte: new Date().toISOString().split('T')[0] },
      status: 'pending',
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch current bookings count' });
  }
});

// Get recent bookings for an athlete
router.get('/athlete/:id/recent', async (req, res) => {
  try {
    const bookings = await Booking.find({
      athlete: req.params.id,
      date: { $gte: new Date().toISOString().split('T')[0] },
      status: { $ne: 'cancelled' },
    })
      .populate('coach', 'name')
      .sort({ date: 1, time: 1 })
      .limit(5);

    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id,
      date: booking.date,
      time: booking.time,
      coachName: booking.coach?.name || 'Coach',
      notes: booking.notes,
      status: booking.status,
    }));

    res.json({ bookings: formattedBookings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent bookings' });
  }
});

export default router;
