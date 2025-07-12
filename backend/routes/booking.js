import express from 'express';
import Booking from '../models/Booking.js';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config.js';

const router = express.Router();
const stripe = new Stripe(STRIPE_SECRET_KEY);

// Create a new booking
router.post('/', async (req, res) => {
  const { coach, athlete, date, time, notes, amount, paymentMethodId } =
    req.body;
  if (!coach || !athlete || !date || !time || !amount || !paymentMethodId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    // 1. Create a PaymentIntent with capture_method: 'manual' (authorize only)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: 'pkr',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      capture_method: 'manual',
      metadata: {
        coach,
        athlete,
        date,
        time,
      },
    });

    // 2. Save booking with paymentIntentId and paymentStatus 'authorized'
    const booking = new Booking({
      coach,
      athlete,
      date,
      time,
      notes,
      paymentIntentId: paymentIntent.id,
      paymentStatus: 'authorized',
    });
    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Coach accepts a session and payment is captured
router.post('/:id/accept', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.paymentStatus !== 'authorized') {
      return res
        .status(400)
        .json({ message: 'Payment is not authorized or already captured.' });
    }
    // Capture the payment
    const paymentIntent = await stripe.paymentIntents.capture(
      booking.paymentIntentId
    );
    booking.paymentStatus = 'captured';
    booking.status = 'completed'; // Optionally mark as completed
    await booking.save();
    res.json({ message: 'Session accepted and payment captured', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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

// Get bookings for a coach (with optional status filter)
router.get('/', async (req, res) => {
  const { coach, status } = req.query;
  const filter = {};
  if (coach) filter.coach = coach;
  if (status) filter.status = status;
  try {
    const bookings = await Booking.find(filter);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

export default router;
