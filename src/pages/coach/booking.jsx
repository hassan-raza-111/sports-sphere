import React, { useState } from 'react';
import { useEffect } from 'react';
import Layout from '../../components/Layout';

const CoachBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState('');

  // Get coach ID from localStorage
  const userStr = localStorage.getItem('user');
  const coachId = userStr ? JSON.parse(userStr)._id : null;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/booking?coach=${coachId}&status=pending`);
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
    } catch (err) {
      setError('Failed to accept booking.');
    } finally {
      setAcceptingId('');
    }
  };

  return (
    <Layout role='coach'>
      <div style={styles.body}>
        <main style={styles.bookingContainer}>
          <h2 style={styles.bookingHeading}>Pending Session Requests</h2>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: '#e74c3c' }}>{error}</div>
          ) : bookings.length === 0 ? (
            <div>No pending bookings.</div>
          ) : (
            <table
              style={{
                width: '100%',
                background: 'white',
                borderRadius: 8,
                boxShadow: '0 2px 8px #eee',
                marginTop: 20,
              }}
            >
              <thead>
                <tr>
                  <th>Athlete</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.athlete}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.notes || '-'}</td>
                    <td>
                      <button
                        style={styles.btn}
                        disabled={acceptingId === b._id}
                        onClick={() => handleAccept(b._id)}
                      >
                        {acceptingId === b._id ? 'Accepting...' : 'Accept'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 5%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoImg: { height: 40, width: 'auto' },
  logoText: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    fontStyle: 'italic',
  },
  nav: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  navLink: {
    fontWeight: 600,
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  badge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    width: 20,
    height: 20,
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  profileBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingContainer: {
    padding: '140px 5% 60px',
    maxWidth: 800,
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
  bookingForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #e74c3c',
    width: '100%',
  },
  formGroup: { marginBottom: '1.5rem' },
  input: {
    width: '100%',
    padding: '0.8rem 1rem',
    border: '2px solid #e1e5eb',
    borderRadius: 5,
    fontSize: '1rem',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: 5,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    gap: 10,
    width: '100%',
  },
  footer: {
    backgroundColor: 'rgba(44, 62, 80, 0.9)',
    color: 'white',
    padding: '2rem 5%',
    marginTop: '3rem',
  },
  footerContent: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  description: { marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1rem' },
  copyright: { fontSize: '0.9rem' },
};

export default CoachBookings;
