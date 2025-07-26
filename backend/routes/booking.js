import express from 'express';
import Booking from '../models/Booking.js';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, FRONTEND_URL } from '../config.js';
import bodyParser from 'body-parser';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

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
      success_url: `${FRONTEND_URL}/athlete/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/athlete/booking`,
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
      // Send email to athlete
      try {
        const athleteUser = await User.findById(booking.athlete);
        if (athleteUser && athleteUser.email) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS,
            },
          });
          const mailOptions = {
            to: athleteUser.email,
            from: process.env.GMAIL_USER,
            subject: 'Your Session Has Been Accepted!',
            html: `<p>Your session has been accepted by the coach.<br/>Session Date: <b>${booking.date}</b><br/>Session Time: <b>${booking.time}</b><br/>Coach: <b>${booking.coach}</b></p>`,
          };
          await transporter.sendMail(mailOptions);
        }
      } catch (mailErr) {
        console.error('Failed to send acceptance email:', mailErr);
      }
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

    // Send email to athlete
    try {
      const athleteUser = await User.findById(booking.athlete);
      if (athleteUser && athleteUser.email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });
        const mailOptions = {
          to: athleteUser.email,
          from: process.env.GMAIL_USER,
          subject: 'Your Session Has Been Accepted!',
          html: `<p>Your session has been accepted by the coach.<br/>Session Date: <b>${booking.date}</b><br/>Session Time: <b>${booking.time}</b><br/>Coach: <b>${booking.coach}</b></p>`,
        };
        await transporter.sendMail(mailOptions);
      }
    } catch (mailErr) {
      console.error('Failed to send acceptance email:', mailErr);
    }

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

    // Check if booking can be rejected
    if (booking.status !== 'pending') {
      console.error(
        'Reject Error: Session is not in pending status.',
        booking.status
      );
      return res.status(400).json({
        message: `Cannot reject session. Current status: ${booking.status}. Only pending sessions can be rejected.`,
      });
    }

    if (booking.paymentStatus !== 'authorized') {
      console.error(
        'Reject Error: Payment not authorized or already processed.',
        booking.paymentStatus
      );
      return res.status(400).json({
        message: `Cannot reject session. Payment status: ${booking.paymentStatus}. Only authorized payments can be cancelled.`,
      });
    }

    // Handle payment cancellation/refund based on payment status
    let paymentResult;
    try {
      if (booking.paymentStatus === 'authorized') {
        // For manual capture payments, cancel the payment intent
        paymentResult = await stripe.paymentIntents.cancel(
          booking.paymentIntentId
        );
        console.log('Payment intent cancelled:', paymentResult.id);
      } else if (booking.paymentStatus === 'captured') {
        // For captured payments, create a refund
        paymentResult = await stripe.refunds.create({
          payment_intent: booking.paymentIntentId,
        });
        console.log('Payment refunded:', paymentResult.id);
      }
    } catch (stripeErr) {
      console.error('Stripe payment error:', stripeErr);
      // Don't fail the request if payment processing fails
      // Just log the error and continue with booking cancellation
      paymentResult = { error: stripeErr.message };
    }

    // Update booking status regardless of payment result
    booking.paymentStatus =
      booking.paymentStatus === 'authorized' ? 'cancelled' : 'refunded';
    booking.status = 'cancelled';
    booking.rejectedAt = new Date();
    if (paymentResult && !paymentResult.error) {
      booking.refundId = paymentResult.id;
    }
    await booking.save();

    res.json({
      message: 'Session rejected successfully',
      booking,
      paymentResult,
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
      .populate({
        path: 'coach',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Process bookings to handle both User ID and Coach ID cases
    const processedBookings = bookings.map((booking) => {
      const bookingObj = booking.toObject();

      // If coach field is populated (Coach model), use coach.userId.name
      if (bookingObj.coach && bookingObj.coach.userId) {
        bookingObj.coachName = bookingObj.coach.userId.name;
        bookingObj.coachEmail = bookingObj.coach.userId.email;
      }
      // If coach field is not populated, it might be a User ID directly
      else if (bookingObj.coach && typeof bookingObj.coach === 'string') {
        // This will be handled by the frontend fallback
        bookingObj.coachName = 'Unknown Coach';
        bookingObj.coachEmail = 'Unknown';
      }
      // If coach field is populated but doesn't have userId (direct Coach model)
      else if (bookingObj.coach && bookingObj.coach.name) {
        bookingObj.coachName = bookingObj.coach.name;
        bookingObj.coachEmail = bookingObj.coach.email;
      } else {
        bookingObj.coachName = 'Unknown Coach';
        bookingObj.coachEmail = 'Unknown';
      }

      return bookingObj;
    });

    const total = await Booking.countDocuments(query);

    res.json({
      bookings: processedBookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error('Error fetching admin bookings:', err);
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

    // Debug: Log booking and paymentIntentId
    console.log(
      'Refunding booking:',
      booking._id,
      'paymentIntentId:',
      booking.paymentIntentId
    );

    if (!booking.paymentIntentId) {
      console.error('No paymentIntentId found for booking:', booking._id);
      return res
        .status(400)
        .json({ message: 'No payment intent found for this booking.' });
    }

    // Only allow valid Stripe reasons
    const allowedReasons = ['duplicate', 'fraudulent', 'requested_by_customer'];
    let refundReason = reason;
    if (!allowedReasons.includes(refundReason)) {
      refundReason = 'requested_by_customer';
    }

    // Refund the payment
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentIntentId,
      reason: refundReason,
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
    // Log the full error
    console.error('Error refunding payment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get booking statistics for admin
router.get('/admin/stats', async (req, res) => {
  try {
    console.log('Fetching booking statistics...');

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

    // Calculate pending payments amount
    const pendingPaymentsData = await Booking.aggregate([
      { $match: { paymentStatus: 'authorized' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const pendingPayments = pendingPaymentsData[0]?.total || 0;

    // Calculate refunded amount
    const refundedData = await Booking.aggregate([
      { $match: { paymentStatus: 'refunded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const refundedAmount = refundedData[0]?.total || 0;

    const stats = {
      totalBookings,
      pendingBookings,
      completedBookings,
      capturedPayments,
      authorizedPayments,
      refundedPayments,
      totalRevenue,
      pendingPayments,
      refundedAmount,
    };

    console.log('Booking stats:', stats);
    res.json(stats);
  } catch (err) {
    console.error('Error fetching booking statistics:', err);
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
    const { completionNotes, performance, focusArea, metrics } = req.body;

    console.log('Completing session with metrics:', { id, metrics });

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if session is already completed
    if (booking.status === 'completed') {
      // If already completed, just update the progress with new metrics
      if (metrics && typeof metrics === 'object') {
        // Validate and structure metrics
        let validMetrics = {
          stamina: 0,
          speed: 0,
          strength: 0,
          focus: 0,
          serveAccuracy: 0,
          backhandPower: 0,
          footworkSpeed: 0,
        };

        if (metrics && typeof metrics === 'object') {
          validMetrics = {
            stamina: Number(metrics.stamina) || 0,
            speed: Number(metrics.speed) || 0,
            strength: Number(metrics.strength) || 0,
            focus: Number(metrics.focus) || 0,
            serveAccuracy: Number(metrics.serveAccuracy) || 0,
            backhandPower: Number(metrics.backhandPower) || 0,
            footworkSpeed: Number(metrics.footworkSpeed) || 0,
          };

          // Validate metric values (0-100)
          Object.keys(validMetrics).forEach((key) => {
            if (validMetrics[key] < 0) validMetrics[key] = 0;
            if (validMetrics[key] > 100) validMetrics[key] = 100;
          });
        }

        // Create a new progress record for the updated metrics
        const progressData = {
          userId: booking.athlete,
          coach: booking.coach,
          date: new Date(), // Use current date when metrics are updated
          duration: booking.duration || '60 min',
          focusArea: focusArea || booking.focusArea || 'General',
          performance: performance || booking.performance || 0,
          coachNotes: completionNotes || booking.completionNotes || '',
          status: 'completed',
          metrics: validMetrics,
        };

        const newProgress = await Progress.create(progressData);

        return res.json({
          message: 'Session metrics updated successfully',
          booking,
          progress: newProgress,
        });
      }

      return res.json({
        message: 'Session is already completed',
        booking,
      });
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

    // Validate and structure metrics
    let validMetrics = {
      stamina: 0,
      speed: 0,
      strength: 0,
      focus: 0,
      serveAccuracy: 0,
      backhandPower: 0,
      footworkSpeed: 0,
    };

    if (metrics && typeof metrics === 'object') {
      validMetrics = {
        stamina: Number(metrics.stamina) || 0,
        speed: Number(metrics.speed) || 0,
        strength: Number(metrics.strength) || 0,
        focus: Number(metrics.focus) || 0,
        serveAccuracy: Number(metrics.serveAccuracy) || 0,
        backhandPower: Number(metrics.backhandPower) || 0,
        footworkSpeed: Number(metrics.footworkSpeed) || 0,
      };

      // Validate metric values (0-100)
      Object.keys(validMetrics).forEach((key) => {
        if (validMetrics[key] < 0) validMetrics[key] = 0;
        if (validMetrics[key] > 100) validMetrics[key] = 100;
      });
    }

    // Create a Progress entry for the athlete with metrics
    const progressData = {
      userId: booking.athlete,
      coach: booking.coach,
      date: new Date(),
      duration: booking.duration || '60 min',
      focusArea: focusArea || 'General',
      performance: performance || 0,
      coachNotes: completionNotes || '',
      status: 'completed',
      metrics: validMetrics,
    };

    console.log('Creating progress with data:', progressData);
    const progress = await Progress.create(progressData);
    console.log('Progress created:', progress);

    res.json({
      message: 'Session completed successfully',
      booking,
      progress,
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
    const bookings = await Booking.find({ athlete: req.params.id })
      .populate('coach', 'name')
      .sort({
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

// Admin: Patch old bookings to set correct Coach _id in coach field
router.post('/admin/fix-coach-ids', async (req, res) => {
  try {
    console.log('Starting coach ID migration...');
    const bookings = await Booking.find();
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const booking of bookings) {
      try {
        // Check if coach field is a string (might be User ID)
        if (typeof booking.coach === 'string') {
          // Try to find Coach model with this userId
          const Coach = require('../models/Coach').default;
          const coachDoc = await Coach.findOne({ userId: booking.coach });

          if (coachDoc) {
            // Update booking with correct Coach _id
            booking.coach = coachDoc._id;
            await booking.save();
            updated++;
            console.log(
              `Updated booking ${booking._id}: User ID ${booking.coach} -> Coach ID ${coachDoc._id}`
            );
          } else {
            // No coach found with this userId
            console.log(
              `No coach found for User ID: ${booking.coach} in booking ${booking._id}`
            );
            errors++;
          }
        } else {
          // Already a valid Coach ID or ObjectId
          skipped++;
        }
      } catch (err) {
        console.error(`Error processing booking ${booking._id}:`, err);
        errors++;
      }
    }

    console.log(
      `Migration completed: ${updated} updated, ${skipped} skipped, ${errors} errors`
    );
    res.json({
      message: 'Coach ID migration completed',
      updated,
      skipped,
      errors,
      total: bookings.length,
    });
  } catch (err) {
    console.error('Migration failed:', err);
    res
      .status(500)
      .json({ error: 'Failed to patch bookings', details: err.message });
  }
});

export default router;
