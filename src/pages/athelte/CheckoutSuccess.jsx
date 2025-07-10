import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/checkout.css';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      confirmOrder(sessionId);
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, [searchParams]);

  const confirmOrder = async (sessionId) => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/payments/confirm-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        }
      );

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
      <AthleteLayout>
        <div className='success-container'>
          <div className='success-card'>
            <div className='loading-spinner'></div>
            <h2>Processing your payment...</h2>
            <p>Please wait while we confirm your order.</p>
          </div>
        </div>
      </AthleteLayout>
    );
  }

  if (error) {
    return (
      <AthleteLayout>
        <div className='success-container'>
          <div className='success-card error'>
            <div className='error-icon'>✗</div>
            <h2>Payment Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/athlete/marketplace')}
              className='continue-shopping'
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </AthleteLayout>
    );
  }

  return (
    <AthleteLayout>
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
            onClick={() => navigate('/athlete/marketplace')}
            className='continue-shopping'
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </AthleteLayout>
  );
};

export default CheckoutSuccess;
