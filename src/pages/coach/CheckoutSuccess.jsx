import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../../config.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import '../../css/checkout.css';

const CoachCheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);
  const calledRef = useRef(false); // Prevent double API call

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && !calledRef.current) {
      calledRef.current = true;
      confirmOrder(sessionId);
    } else if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  const confirmOrder = async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/confirm-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const result = await response.json();

      if (result.success) {
        setOrderId(result.orderId);
      } else {
        setError(result.message || 'Failed to confirm order');
      }
    } catch (err) {
      setError('Error confirming order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout role='coach'>
        <div className='success-container'>
          <div className='success-card'>
            <div className='loading-spinner'></div>
            <h2>Processing your payment...</h2>
            <p>Please wait while we confirm your order.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout role='coach'>
        <div className='success-container'>
          <div className='success-card error'>
            <div className='error-icon'>✗</div>
            <h2>Payment Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/coach/marketplace')}
              className='continue-shopping'
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role='coach'>
      <div className='success-container'>
        <div className='success-card'>
          <div className='success-icon'>✓</div>
          <h2>Payment Successful!</h2>
          <p>Your order has been placed successfully.</p>
          {orderId && <p>Order ID: {orderId}</p>}
          <div className='success-details'>
            <p>You will receive an email confirmation shortly.</p>
            <p>Thank you for your purchase!</p>
          </div>
          <button
            onClick={() => navigate('/coach/marketplace')}
            className='continue-shopping'
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CoachCheckoutSuccess;
