import express from 'express';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Check if Stripe is configured
if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not configured');
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { userId, cartItems, shippingInfo } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!shippingInfo) {
      return res
        .status(400)
        .json({ message: 'Shipping information is required' });
    }

    // Validate cart items

    for (const item of cartItems) {
      if (
        !item._id ||
        !item.name ||
        item.price === undefined ||
        item.quantity === undefined
      ) {
        return res.status(400).json({
          message: 'Invalid cart item data - missing required fields',
          item: item,
        });
      }

      // Ensure price and quantity are numbers
      if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return res.status(400).json({
          message: 'Price and quantity must be numbers',
          item: item,
        });
      }

      if (item.price <= 0 || item.quantity <= 0) {
        console.error('Invalid values in cart item:', item);
        return res.status(400).json({
          message: 'Price and quantity must be greater than 0',
          item: item,
        });
      }
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      return res
        .status(400)
        .json({ message: 'Total amount must be greater than 0' });
    }

    // Stripe minimum: ₨150 (PKR)
    const MINIMUM_AMOUNT_PKR = 150;

    if (totalAmount < MINIMUM_AMOUNT_PKR) {
      return res.status(400).json({
        message: `Minimum order amount for Stripe is ₨${MINIMUM_AMOUNT_PKR}. Please add more items to your cart.`,
      });
    }

    // Use PKR directly (Stripe supports PKR)
    const amountInCents = Math.round(totalAmount * 100);

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => {
      // Use PKR directly
      const itemPriceCents = Math.round(item.price * 100);

      // Ensure minimum amount for Stripe (₨150 PKR)
      if (itemPriceCents < 15000) {
        // 15000 cents = ₨150
        console.warn(
          `Item ${item.name} price too low: ${itemPriceCents} cents, setting to minimum`
        );
        itemPriceCents = 15000;
      }

      // Create simplified product data (no images to avoid URL issues)
      const productData = {
        name: item.name,
        description: item.description || `Product: ${item.name}`,
      };

      return {
        price_data: {
          currency: 'pkr',
          product_data: productData,
          unit_amount: itemPriceCents,
        },
        quantity: item.quantity,
      };
    });

    // Defensive check for lineItems
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ message: 'No valid items to checkout.' });
    }

    for (const li of lineItems) {
      if (
        !li.price_data ||
        typeof li.price_data.unit_amount !== 'number' ||
        li.price_data.unit_amount <= 0 ||
        !li.price_data.product_data ||
        !li.price_data.product_data.name ||
        !li.quantity ||
        li.quantity <= 0
      ) {
        console.error('Invalid line item structure:', li);
        return res.status(400).json({
          message: 'Invalid line item for Stripe.',
          invalidItem: li,
        });
      }

      // Additional validation for Stripe requirements
      if (li.price_data.unit_amount < 15000) {
        // Stripe minimum is ₨150 PKR
        console.error('Line item amount too low:', li.price_data.unit_amount);
        return res.status(400).json({
          message: 'Item price too low for Stripe. Minimum is ₨150 PKR.',
          item: li,
        });
      }
    }

    console.log('Creating checkout session with:', {
      userId,
      totalAmount,
      amountInCents,
      lineItemsCount: lineItems.length,
      lineItems: lineItems.map((item) => ({
        name: item.price_data.product_data.name,
        unit_amount: item.price_data.unit_amount,
        quantity: item.quantity,
        currency: item.price_data.currency,
      })),
    });

    // Determine if this is a coach or athlete checkout
    const isCoach = req.body.role === 'coach';

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: isCoach
        ? `${FRONTEND_URL}/coach/checkout/success?session_id={CHECKOUT_SESSION_ID}`
        : `${FRONTEND_URL}/athlete/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: isCoach
        ? `${FRONTEND_URL}/coach/marketplace`
        : `${FRONTEND_URL}/athlete/marketplace`,
      metadata: {
        userId: userId,
        role: isCoach ? 'coach' : 'athlete',
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    console.log('Checkout session created:', session.id);

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error type:', error.type);
    console.error('Error message:', error.message);

    if (error.raw) {
      console.error('Stripe error details:', error.raw);
    }

    // Log the line items that were sent to Stripe
    console.error('Line items sent to Stripe:', lineItems);

    // Provide more specific error messages
    if (error.type === 'StripeInvalidRequestError') {
      console.error('Stripe invalid request error details:', {
        message: error.message,
        param: error.param,
        code: error.code,
      });

      return res.status(400).json({
        message: `Invalid request to Stripe: ${error.message}`,
        details: error.param
          ? `Invalid parameter: ${error.param}`
          : 'Unknown parameter error',
      });
    }

    if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({
        message: 'Stripe authentication failed. Please contact support.',
      });
    }

    res.status(500).json({
      message: 'Error creating checkout session. Please try again.',
      error: error.message,
    });
  }
});

// Handle successful payment (called from success page)
router.post('/confirm-order', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Get data from metadata
    const userId = session.metadata.userId;
    const cartItems = JSON.parse(session.metadata.cartItems);
    const shippingInfo = JSON.parse(session.metadata.shippingInfo);
    const totalAmount = session.amount_total / 100; // Convert from cents

    // 🟢 CHECK FOR EXISTING ORDER
    const existingOrder = await Order.findOne({
      transactionId: session.payment_intent,
    });
    if (existingOrder) {
      return res.json({
        success: true,
        orderId: existingOrder._id,
        message: 'Order already placed',
      });
    }

    // Create order
    const order = new Order({
      userId,
      products: cartItems,
      totalAmount,
      paymentMethod: 'stripe',
      paymentStatus: 'completed',
      transactionId: session.payment_intent,
      paymentDate: new Date(),
      shippingInfo,
    });

    await order.save();

    // Update product stock
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.json({
      success: true,
      orderId: order._id,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ message: 'Error confirming order' });
  }
});

// Get payment status
router.get('/payment-status/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId
    );
    res.json({
      status: session.payment_status,
      session: session,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({ message: 'Error retrieving payment status' });
  }
});

export default router;
