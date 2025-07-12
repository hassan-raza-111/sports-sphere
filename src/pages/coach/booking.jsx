import React, { useState } from 'react';
import { useEffect } from 'react';
import Layout from '../../components/Layout';

const CoachBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState('');
  const [rejectingId, setRejectingId] = useState('');

  // Get coach ID from localStorage
  const userStr = localStorage.getItem('user');
  const coachId = userStr ? JSON.parse(userStr)._id : null;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/booking/coach/${coachId}/pending`);
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    if (coachId) fetchBookings();
  }, [coachId]);

  const handleAccept = async (bookingId) => {
    setAcceptingId(bookingId);
    setError('');
    try {
      const res = await fetch(`/api/booking/${bookingId}/accept`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to accept booking');
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert('Session accepted successfully! Payment has been captured.');
    } catch (err) {
      setError('Failed to accept booking.');
    } finally {
      setAcceptingId('');
    }
  };

  const handleReject = async (bookingId) => {
    setRejectingId(bookingId);
    setError('');
    try {
      const res = await fetch(`/api/booking/${bookingId}/reject`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to reject booking');
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert('Session rejected successfully! Payment has been refunded.');
    } catch (err) {
      setError('Failed to reject booking.');
    } finally {
      setRejectingId('');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };

  const formatAmount = (amount) => {
    return `PKR ${amount}`;
  };

  return (
    <Layout role='coach'>
      <div style={styles.body}>
        <main style={styles.bookingContainer}>
          <h2 style={styles.bookingHeading}>
            <i className='fas fa-clock'></i> Pending Session Requests
          </h2>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p>Loading pending sessions...</p>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <i className='fas fa-exclamation-triangle'></i>
              <span>{error}</span>
            </div>
          ) : bookings.length === 0 ? (
            <div style={styles.emptyContainer}>
              <i className='fas fa-check-circle'></i>
              <p>No pending session requests.</p>
              <small>All sessions have been processed.</small>
            </div>
          ) : (
            <div style={styles.bookingsGrid}>
              {bookings.map((booking) => (
                <div key={booking._id} style={styles.bookingCard}>
                  <div style={styles.bookingHeader}>
                    <div style={styles.athleteInfo}>
                      <i className='fas fa-user'></i>
                      <span>{booking.athlete?.name || 'Athlete'}</span>
                    </div>
                    <div style={styles.amount}>
                      {formatAmount(booking.amount)}
                    </div>
                  </div>

                  <div style={styles.bookingDetails}>
                    <div style={styles.detailItem}>
                      <i className='fas fa-calendar'></i>
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <i className='fas fa-clock'></i>
                      <span>{formatTime(booking.time)}</span>
                    </div>
                    {booking.notes && (
                      <div style={styles.detailItem}>
                        <i className='fas fa-sticky-note'></i>
                        <span>{booking.notes}</span>
                      </div>
                    )}
                  </div>

                  <div style={styles.bookingActions}>
                    <button
                      style={{
                        ...styles.btn,
                        ...styles.acceptBtn,
                        opacity: acceptingId === booking._id ? 0.7 : 1,
                      }}
                      disabled={
                        acceptingId === booking._id ||
                        rejectingId === booking._id
                      }
                      onClick={() => handleAccept(booking._id)}
                    >
                      {acceptingId === booking._id ? (
                        <>
                          <i className='fas fa-spinner fa-spin'></i>
                          Accepting...
                        </>
                      ) : (
                        <>
                          <i className='fas fa-check'></i>
                          Accept Session
                        </>
                      )}
                    </button>

                    <button
                      style={{
                        ...styles.btn,
                        ...styles.rejectBtn,
                        opacity: rejectingId === booking._id ? 0.7 : 1,
                      }}
                      disabled={
                        rejectingId === booking._id ||
                        acceptingId === booking._id
                      }
                      onClick={() => handleReject(booking._id)}
                    >
                      {rejectingId === booking._id ? (
                        <>
                          <i className='fas fa-spinner fa-spin'></i>
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <i className='fas fa-times'></i>
                          Reject Session
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    lineHeight: 1.6,
    minHeight: '100vh',
  },
  bookingContainer: {
    padding: '140px 5% 60px',
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bookingHeading: {
    fontSize: '2.2rem',
    color: 'white',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    textAlign: 'center',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: 'white',
    fontSize: '1.1rem',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(231, 76, 60, 0.3)',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: 'white',
    textAlign: 'center',
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
    width: '100%',
  },
  bookingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #e74c3c',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #ecf0f1',
  },
  athleteInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50',
  },
  amount: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#e74c3c',
  },
  bookingDetails: {
    marginBottom: '1.5rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '0.5rem',
    color: '#7f8c8d',
  },
  bookingActions: {
    display: 'flex',
    gap: '1rem',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    gap: '8px',
    flex: 1,
    transition: 'all 0.3s',
  },
  acceptBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
  },
  rejectBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
};

export default CoachBookings;
