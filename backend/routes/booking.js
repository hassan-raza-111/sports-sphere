import express from 'express';
import Booking from '../models/Booking.js';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config.js';
import bodyParser from 'body-parser';
import Progress from '../models/Progress.js';

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
      amount: amount, // Add amount field
    });
    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create Stripe Checkout Session for session booking
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { coach, athlete, date, time, notes, amount } = req.body;
    if (!coach || !athlete || !date || !time || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Create a PaymentIntent with manual capture
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: 'Coaching Session',
              description: `Session with Coach ${coach}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_intent_data: {
        capture_method: 'manual',
        metadata: {
          coach,
          athlete,
          date,
          time,
          notes,
        },
      },
      success_url: `http://localhost:5173/athlete/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:5173/athlete/booking',
      metadata: {
        coach,
        athlete,
        date,
        time,
        notes,
      },
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
});

// Coach accepts a session and payment is captured
router.post('/:id/accept', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status !== 'pending') {
      return res
        .status(400)
        .json({ message: 'Session is not in pending status.' });
    }

    // Always fetch latest paymentIntent status from Stripe
    let paymentIntent;
    if (booking.paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.retrieve(
        booking.paymentIntentId
      );
    }

    // If Stripe says already captured, sync local status and accept
    if (
      paymentIntent &&
      (paymentIntent.status === 'succeeded' ||
        paymentIntent.status === 'captured')
    ) {
      booking.paymentStatus = 'captured';
      booking.status = 'accepted';
      booking.acceptedAt = new Date();
      await booking.save();
      return res.json({
        message: 'Session accepted (payment was already captured on Stripe)',
        booking,
      });
    }

    if (booking.paymentStatus !== 'authorized') {
      return res
        .status(400)
        .json({ message: 'Payment is not authorized or already captured.' });
    }

    // Capture the payment
    const capturedIntent = await stripe.paymentIntents.capture(
      booking.paymentIntentId
    );

    // Update booking status to 'accepted'
    booking.paymentStatus = 'captured';
    booking.status = 'accepted';
    booking.acceptedAt = new Date();
    await booking.save();

    res.json({
      message:
        'Session accepted and payment captured. Coach can now conduct the session.',
      booking,
      paymentIntent: capturedIntent,
    });
  } catch (err) {
    console.error('Error accepting booking:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Coach rejects a session and payment is refunded
router.post('/:id/reject', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      console.error('Reject Error: Booking not found for id', req.params.id);
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.paymentStatus !== 'authorized') {
      console.error(
        'Reject Error: Payment not authorized or already processed.',
        booking
      );
      return res
        .status(400)
        .json({ message: 'Payment is not authorized or already processed.' });
    }
    if (booking.status !== 'pending') {
      console.error('Reject Error: Session is not in pending status.', booking);
      return res
        .status(400)
        .json({ message: 'Session is not in pending status.' });
    }

    // Refund the payment
    let refund;
    try {
      refund = await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
      });
    } catch (stripeErr) {
      console.error('Stripe refund error:', stripeErr);
      return res
        .status(500)
        .json({ message: 'Stripe refund failed', error: stripeErr.message });
    }

    // Update booking status
    booking.paymentStatus = 'refunded';
    booking.status = 'cancelled';
    booking.rejectedAt = new Date();
    booking.refundId = refund.id;
    await booking.save();

    res.json({
      message: 'Session rejected and payment refunded',
      booking,
      refund,
    });
  } catch (err) {
    console.error('Error rejecting booking:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get pending and accepted sessions for coach (sessions ready to be conducted)
router.get('/coach/:coachId/pending', async (req, res) => {
  try {
    const bookings = await Booking.find({
      coach: req.params.coachId,
      status: { $in: ['pending', 'accepted'] },
      paymentStatus: { $in: ['authorized', 'captured'] },
    }).populate('athlete', 'name email');

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending sessions' });
  }
});

// Get all bookings for admin management
router.get('/admin', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus, search } = req.query;

    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { athlete: { $regex: search, $options: 'i' } },
        { coach: { $regex: search, $options: 'i' } },
        { paymentIntentId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const bookings = await Booking.find(query)
      .populate('athlete', 'name email')
      .populate('coach', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Admin manually capture payment
router.post('/admin/:id/capture', async (req, res) => {
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

    // Update booking status
    booking.paymentStatus = 'captured';
    booking.status = 'completed';
    booking.capturedAt = new Date();
    await booking.save();

    res.json({
      message: 'Payment captured successfully',
      booking,
      paymentIntent,
    });
  } catch (err) {
    console.error('Error capturing payment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin manually refund payment
router.post('/admin/:id/refund', async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (
      booking.paymentStatus !== 'captured' &&
      booking.paymentStatus !== 'authorized'
    ) {
      return res.status(400).json({ message: 'Payment cannot be refunded.' });
    }

    // Refund the payment
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentIntentId,
      reason: reason || 'requested_by_customer',
    });

    // Update booking status
    booking.paymentStatus = 'refunded';
    booking.status = 'cancelled';
    booking.refundedAt = new Date();
    booking.refundId = refund.id;
    booking.refundReason = reason;
    await booking.save();

    res.json({
      message: 'Payment refunded successfully',
      booking,
      refund,
    });
  } catch (err) {
    console.error('Error refunding payment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get booking statistics for admin
router.get('/admin/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({
      status: 'completed',
    });
    const capturedPayments = await Booking.countDocuments({
      paymentStatus: 'captured',
    });
    const authorizedPayments = await Booking.countDocuments({
      paymentStatus: 'authorized',
    });
    const refundedPayments = await Booking.countDocuments({
      paymentStatus: 'refunded',
    });

    // Calculate total revenue
    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      totalBookings,
      pendingBookings,
      completedBookings,
      capturedPayments,
      authorizedPayments,
      refundedPayments,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch booking statistics' });
  }
});

// Stripe webhook endpoint
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      try {
        // Only create booking if not already exists for this paymentIntent
        const existing = await Booking.findOne({
          paymentIntentId: session.payment_intent,
        });
        if (!existing) {
          const meta = session.metadata || {};
          const booking = new Booking({
            coach: meta.coach,
            athlete: meta.athlete,
            date: meta.date,
            time: meta.time,
            notes: meta.notes,
            paymentIntentId: session.payment_intent,
            paymentStatus: 'authorized',
            status: 'pending',
            amount: session.amount_total / 100, // Convert from cents
          });
          await booking.save();
          console.log('Booking created from Stripe webhook:', booking._id);
        }
      } catch (err) {
        console.error('Error creating booking from webhook:', err);
        return res.status(500).send('Webhook handler failed');
      }
    }
    res.json({ received: true });
  }
);

// Confirm session booking after Stripe Checkout success (no webhook)
router.post('/confirm-session-booking', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // Debug log
    console.log('Stripe session:', session);
    // Retrieve payment intent for manual capture status
    let paymentIntent = null;
    if (session.payment_intent) {
      paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );
      console.log('Stripe paymentIntent:', paymentIntent);
    }
    // Accept if session.payment_status is 'paid' OR paymentIntent.status is 'requires_capture'
    if (
      session.payment_status !== 'paid' &&
      (!paymentIntent || paymentIntent.status !== 'requires_capture')
    ) {
      return res.status(400).json({ message: 'Payment not completed' });
    }
    // Check if booking already exists
    const existing = await Booking.findOne({
      paymentIntentId: session.payment_intent,
    });
    if (existing) {
      return res.json({
        success: true,
        booking: existing,
        message: 'Booking already exists',
      });
    }
    // Create booking from session metadata
    const meta = session.metadata || {};
    const booking = new Booking({
      coach: meta.coach,
      athlete: meta.athlete,
      date: meta.date,
      time: meta.time,
      notes: meta.notes,
      paymentIntentId: session.payment_intent,
      paymentStatus: 'authorized',
      status: 'pending',
      amount: session.amount_total / 100, // Convert from cents
    });
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    console.error('Error confirming session booking:', err);
    res.status(500).json({ message: 'Failed to confirm session booking' });
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

// Coach completes a session
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { completionNotes, performance, focusArea } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (
      booking.status !== 'accepted' &&
      booking.status !== 'conducted' &&
      booking.status !== 'pending'
    ) {
      return res.status(400).json({
        message:
          'Session can only be completed if it is accepted, conducted, or pending. Current status: ' +
          booking.status,
      });
    }

    // Update booking status to completed
    booking.status = 'completed';
    booking.completionNotes = completionNotes;
    booking.performance = performance;
    booking.focusArea = focusArea;
    booking.completedAt = new Date();
    await booking.save();

    // Create a Progress entry for the athlete
    await Progress.create({
      userId: booking.athlete,
      date: booking.date,
      duration: booking.duration || '60 min',
      focusArea: focusArea || 'General',
      performance: performance || 0,
      coachNotes: completionNotes || '',
      status: 'completed',
    });

    res.json({
      message: 'Session completed successfully',
      booking,
    });
  } catch (err) {
    console.error('Error completing session:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Coach starts conducting a session
router.put('/:id/conduct', async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionNotes } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'accepted') {
      return res.status(400).json({
        message: 'Session can only be conducted if it is accepted',
      });
    }

    // Update booking status to conducted
    booking.status = 'conducted';
    booking.sessionNotes = sessionNotes;
    booking.conductedAt = new Date();
    await booking.save();

    res.json({
      message: 'Session is now being conducted',
      booking,
    });
  } catch (err) {
    console.error('Error starting session conduction:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get conducted sessions for coach
router.get('/coach/:coachId/conducted', async (req, res) => {
  try {
    const bookings = await Booking.find({
      coach: req.params.coachId,
      status: 'conducted',
    })
      .populate('athlete', 'name email')
      .sort({ conductedAt: -1 });

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch conducted sessions' });
  }
});

// Get completed sessions for coach
router.get('/coach/:coachId/completed', async (req, res) => {
  try {
    const bookings = await Booking.find({
      coach: req.params.coachId,
      status: 'completed',
    })
      .populate('athlete', 'name email')
      .sort({ completedAt: -1 });

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch completed sessions' });
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

// Get all sessions for an athlete
router.get('/athlete/:id/all', async (req, res) => {
  try {
    const bookings = await Booking.find({ athlete: req.params.id }).sort({
      date: -1,
      time: -1,
    });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
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
