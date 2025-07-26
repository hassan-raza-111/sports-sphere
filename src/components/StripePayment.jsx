import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { API_BASE_URL } from '../config.js';

// Load Stripe (replace with your publishable key)
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key'
);

const CheckoutForm = ({
  cartItems,
  userId,
  shippingInfo,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      setLoading(false);
      return;
    }

    try {
      // Create payment intent
      const response = await fetch(
        `${API_BASE_URL}/payments/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            cartItems,
          }),
        }
      );

      const { clientSecret, paymentIntentId } = await response.json();

      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const confirmResponse = await fetch(
          `${API_BASE_URL}/payments/confirm-payment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId,
              userId,
              shippingInfo,
            }),
          }
        );

        const confirmData = await confirmResponse.json();

        if (confirmData.success) {
          onSuccess(confirmData);
        } else {
          setError('Payment confirmation failed');
        }
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className='stripe-payment-form'>
      <div className='form-section'>
        <h3>
          <i className='fas fa-credit-card'></i> Payment Details
        </h3>
        <div className='card-element-container'>
          <CardElement options={cardElementOptions} />
        </div>
        {error && (
          <div className='payment-error'>
            <i className='fas fa-exclamation-triangle'></i>
            {error}
          </div>
        )}
        <button
          type='submit'
          disabled={!stripe || loading}
          className='payment-button'
        >
          {loading ? (
            <>
              <i className='fas fa-spinner fa-spin'></i>
              Processing Payment...
            </>
          ) : (
            <>
              <i className='fas fa-lock'></i>
              Pay Now
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const StripePayment = ({
  cartItems,
  userId,
  shippingInfo,
  onSuccess,
  onError,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        cartItems={cartItems}
        userId={userId}
        shippingInfo={shippingInfo}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;
