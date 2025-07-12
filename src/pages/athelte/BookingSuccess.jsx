import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/checkout.css';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState(null);
  const calledRef = useRef(false); // Prevent double API call

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && !calledRef.current) {
      calledRef.current = true;
      confirmSessionBooking(sessionId);
    } else if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  const confirmSessionBooking = async (sessionId) => {
    try {
      const response = await fetch('/api/booking/confirm-session-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      const result = await response.json();
      if (result.success) {
        setBookingId(result.booking._id);
      } else {
        setError(result.message || 'Failed to confirm booking');
      }
    } catch (err) {
      setError('Error confirming booking');
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
            <h2>Processing your booking...</h2>
            <p>Please wait while we confirm your session booking.</p>
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
            <h2>Booking Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/athlete/booking')}
              className='continue-shopping'
            >
              Back to Booking
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
          <h2>Booking Successful!</h2>
          <p>Your session booking and payment authorization was successful.</p>
          {bookingId && <p>Booking ID: {bookingId}</p>}
          <div className='success-details'>
            <p>
              Once your coach accepts the session, your payment will be
              completed.
            </p>
          </div>
          <button
            onClick={() => navigate('/athlete/dashboard')}
            className='continue-shopping'
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </AthleteLayout>
  );
};

export default BookingSuccess;
