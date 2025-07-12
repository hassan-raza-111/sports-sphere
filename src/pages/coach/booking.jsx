import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import {
  FaCheck,
  FaTimes,
  FaClock,
  FaCalendarCheck,
  FaUser,
  FaMoneyBillWave,
  FaStickyNote,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

const CoachBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [conductedBookings, setConductedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState('');
  const [rejectingId, setRejectingId] = useState('');
  const [completingId, setCompletingId] = useState('');
  const [conductingId, setConductingId] = useState('');
  const [coachId, setCoachId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // pending, conducted, completed

  // Get coach userId from localStorage
  const userStr = localStorage.getItem('user');
  const userId = userStr ? JSON.parse(userStr)._id : null;

  // Fetch Coach model _id using userId
  useEffect(() => {
    const fetchCoachId = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/coaches/profile/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch coach profile');
        const data = await res.json();
        setCoachId(data._id); // Coach model _id
      } catch (err) {
        setError('Failed to load coach profile.');
      }
    };
    fetchCoachId();
  }, [userId]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch pending sessions
      const pendingRes = await fetch(`/api/booking/coach/${coachId}/pending`);
      if (!pendingRes.ok) throw new Error('Failed to fetch pending bookings');
      const pendingData = await pendingRes.json();
      setBookings(pendingData.bookings || []);

      // Fetch conducted sessions
      const conductedRes = await fetch(
        `/api/booking/coach/${coachId}/conducted`
      );
      if (conductedRes.ok) {
        const conductedData = await conductedRes.json();
        setConductedBookings(conductedData.bookings || []);
      }

      // Fetch completed sessions
      const completedRes = await fetch(
        `/api/booking/coach/${coachId}/completed`
      );
      if (completedRes.ok) {
        const completedData = await completedRes.json();
        setCompletedBookings(completedData.bookings || []);
      }
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

      // Update the session status locally
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'accepted' }
            : booking
        )
      );

      alert(
        'Session accepted successfully! Payment has been captured. You can now conduct the session.'
      );
      // Refresh data to ensure UI is in sync
      await fetchBookings();
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

  const handleComplete = async (bookingId) => {
    setCompletingId(bookingId);
    setError('');
    try {
      const res = await fetch(`/api/booking/${bookingId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completionNotes: 'Session completed successfully',
        }),
      });
      if (!res.ok) throw new Error('Failed to complete session');

      // Move from conducted to completed
      const completedSession = conductedBookings.find(
        (b) => b._id === bookingId
      );
      if (completedSession) {
        const updatedSession = { ...completedSession, status: 'completed' };
        setCompletedBookings((prev) => [updatedSession, ...prev]);
        setConductedBookings((prev) => prev.filter((b) => b._id !== bookingId));
      }

      alert('Session completed successfully!');
      // Refresh data to ensure UI is in sync
      await fetchBookings();
    } catch (err) {
      setError('Failed to complete session.');
    } finally {
      setCompletingId('');
    }
  };

  const handleConduct = async (bookingId) => {
    setConductingId(bookingId);
    setError('');
    try {
      const res = await fetch(`/api/booking/${bookingId}/conduct`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionNotes: 'Session started',
        }),
      });
      if (!res.ok) throw new Error('Failed to start conducting session');

      // Move from accepted to conducted
      const conductedSession = bookings.find((b) => b._id === bookingId);
      if (conductedSession) {
        const updatedSession = { ...conductedSession, status: 'conducted' };
        setConductedBookings((prev) => [updatedSession, ...prev]);
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      }

      alert('Session is now being conducted!');
      // Refresh data to ensure UI is in sync
      await fetchBookings();
    } catch (err) {
      setError('Failed to start conducting session.');
    } finally {
      setConductingId('');
    }
  };

  const openSessionModal = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const closeSessionModal = () => {
    setShowSessionModal(false);
    setSelectedSession(null);
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

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: '#f39c12',
      accepted: '#3498db',
      conducted: '#9b59b6',
      completed: '#27ae60',
      cancelled: '#e74c3c',
    };

    return (
      <span
        style={{
          padding: '0.3rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          backgroundColor: statusColors[status] || '#95a5a6',
          color: 'white',
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <Layout role='coach'>
      <div style={styles.body}>
        <main style={styles.bookingContainer}>
          <h2 style={styles.bookingHeading}>
            <FaCalendarCheck /> Session Management
          </h2>

          {/* Tab Navigation */}
          <div style={styles.tabContainer}>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === 'pending' && styles.activeTab),
              }}
              onClick={() => setActiveTab('pending')}
            >
              <FaClock /> Ready to Conduct ({bookings.length})
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === 'conducted' && styles.activeTab),
              }}
              onClick={() => setActiveTab('conducted')}
            >
              <FaClock /> Currently Conducting ({conductedBookings.length})
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === 'completed' && styles.activeTab),
              }}
              onClick={() => setActiveTab('completed')}
            >
              <FaCheckCircle /> Completed Sessions ({completedBookings.length})
            </button>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p>Loading sessions...</p>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          ) : activeTab === 'pending' ? (
            bookings.length === 0 ? (
              <div style={styles.emptyContainer}>
                <FaCheckCircle />
                <p>No sessions ready to conduct.</p>
                <small>Pending and accepted sessions will appear here.</small>
              </div>
            ) : (
              <div style={styles.bookingsGrid}>
                {bookings.map((booking) => (
                  <div key={booking._id} style={styles.bookingCard}>
                    <div style={styles.bookingHeader}>
                      <div style={styles.athleteInfo}>
                        <FaUser />
                        <span>{booking.athlete?.name || 'Athlete'}</span>
                      </div>
                      <div style={styles.amount}>
                        {formatAmount(booking.amount)}
                      </div>
                    </div>

                    <div style={styles.bookingDetails}>
                      <div style={styles.detailItem}>
                        <FaCalendarCheck />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <FaClock />
                        <span>{formatTime(booking.time)}</span>
                      </div>
                      {booking.notes && (
                        <div style={styles.detailItem}>
                          <FaStickyNote />
                          <span>{booking.notes}</span>
                        </div>
                      )}
                    </div>

                    <div style={styles.bookingActions}>
                      <button
                        style={{
                          ...styles.btn,
                          ...styles.viewBtn,
                        }}
                        onClick={() => openSessionModal(booking)}
                      >
                        <FaEye /> View Details
                      </button>

                      {booking.status === 'accepted' && (
                        <button
                          style={{
                            ...styles.btn,
                            ...styles.conductBtn,
                            opacity: conductingId === booking._id ? 0.7 : 1,
                          }}
                          disabled={
                            conductingId === booking._id ||
                            acceptingId === booking._id ||
                            rejectingId === booking._id
                          }
                          onClick={() => handleConduct(booking._id)}
                        >
                          {conductingId === booking._id ? (
                            <>
                              <div style={styles.spinner}></div>
                              Starting...
                            </>
                          ) : (
                            <>
                              <FaClock />
                              Start Conducting
                            </>
                          )}
                        </button>
                      )}

                      {booking.status === 'pending' && (
                        <>
                          <button
                            style={{
                              ...styles.btn,
                              ...styles.acceptBtn,
                              opacity: acceptingId === booking._id ? 0.7 : 1,
                            }}
                            disabled={
                              acceptingId === booking._id ||
                              rejectingId === booking._id ||
                              completingId === booking._id
                            }
                            onClick={() => handleAccept(booking._id)}
                          >
                            {acceptingId === booking._id ? (
                              <>
                                <div style={styles.spinner}></div>
                                Accepting...
                              </>
                            ) : (
                              <>
                                <FaCheck />
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
                              acceptingId === booking._id ||
                              completingId === booking._id
                            }
                            onClick={() => handleReject(booking._id)}
                          >
                            {rejectingId === booking._id ? (
                              <>
                                <div style={styles.spinner}></div>
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <FaTimes />
                                Reject Session
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'conducted' ? (
            conductedBookings.length === 0 ? (
              <div style={styles.emptyContainer}>
                <FaClock />
                <p>No sessions currently being conducted.</p>
                <small>
                  Sessions you are currently conducting will appear here.
                </small>
              </div>
            ) : (
              <div style={styles.bookingsGrid}>
                {conductedBookings.map((booking) => (
                  <div key={booking._id} style={styles.bookingCard}>
                    <div style={styles.bookingHeader}>
                      <div style={styles.athleteInfo}>
                        <FaUser />
                        <span>{booking.athlete?.name || 'Athlete'}</span>
                      </div>
                      <div style={styles.amount}>
                        {formatAmount(booking.amount)}
                      </div>
                    </div>

                    <div style={styles.bookingDetails}>
                      <div style={styles.detailItem}>
                        <FaCalendarCheck />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <FaClock />
                        <span>{formatTime(booking.time)}</span>
                      </div>
                      {booking.notes && (
                        <div style={styles.detailItem}>
                          <FaStickyNote />
                          <span>{booking.notes}</span>
                        </div>
                      )}
                    </div>

                    <div style={styles.bookingActions}>
                      <button
                        style={{
                          ...styles.btn,
                          ...styles.viewBtn,
                        }}
                        onClick={() => openSessionModal(booking)}
                      >
                        <FaEye /> View Details
                      </button>

                      <button
                        style={{
                          ...styles.btn,
                          ...styles.completeBtn,
                          opacity: completingId === booking._id ? 0.7 : 1,
                        }}
                        disabled={
                          completingId === booking._id ||
                          acceptingId === booking._id ||
                          rejectingId === booking._id
                        }
                        onClick={() => handleComplete(booking._id)}
                      >
                        {completingId === booking._id ? (
                          <>
                            <div style={styles.spinner}></div>
                            Completing...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle />
                            Complete Session
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : // Completed Sessions Tab
          completedBookings.length === 0 ? (
            <div style={styles.emptyContainer}>
              <FaCheckCircle />
              <p>No completed sessions yet.</p>
              <small>Completed sessions will appear here.</small>
            </div>
          ) : (
            <div style={styles.bookingsGrid}>
              {completedBookings.map((booking) => (
                <div key={booking._id} style={styles.bookingCard}>
                  <div style={styles.bookingHeader}>
                    <div style={styles.athleteInfo}>
                      <FaUser />
                      <span>{booking.athlete?.name || 'Athlete'}</span>
                    </div>
                    <div style={styles.amount}>
                      {formatAmount(booking.amount)}
                    </div>
                  </div>

                  <div style={styles.bookingDetails}>
                    <div style={styles.detailItem}>
                      <FaCalendarCheck />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <FaClock />
                      <span>{formatTime(booking.time)}</span>
                    </div>
                    {booking.notes && (
                      <div style={styles.detailItem}>
                        <FaStickyNote />
                        <span>{booking.notes}</span>
                      </div>
                    )}
                  </div>

                  <div style={styles.bookingActions}>
                    <button
                      style={{
                        ...styles.btn,
                        ...styles.viewBtn,
                      }}
                      onClick={() => openSessionModal(booking)}
                    >
                      <FaEye /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Session Details Modal */}
      {showSessionModal && selectedSession && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeSessionModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeSessionModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#7f8c8d',
              }}
            >
              <FaTimes />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                <FaCalendarCheck
                  style={{ marginRight: '0.5rem', color: '#e74c3c' }}
                />
                Session Details
              </h2>
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                Complete session information
              </p>
            </div>

            {/* Session Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  borderLeft: '4px solid #e74c3c',
                }}
              >
                <FaUser style={{ marginRight: '0.5rem', color: '#e74c3c' }} />
                <div>
                  <strong style={{ color: '#2c3e50' }}>Athlete:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                    {selectedSession.athlete?.name || 'N/A'}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  borderLeft: '4px solid #3498db',
                }}
              >
                <FaCalendarCheck
                  style={{ marginRight: '0.5rem', color: '#3498db' }}
                />
                <div>
                  <strong style={{ color: '#2c3e50' }}>Date:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                    {formatDate(selectedSession.date)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  borderLeft: '4px solid #2ecc71',
                }}
              >
                <FaClock style={{ marginRight: '0.5rem', color: '#2ecc71' }} />
                <div>
                  <strong style={{ color: '#2c3e50' }}>Time:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                    {formatTime(selectedSession.time)}
                  </span>
                </div>
              </div>

              {selectedSession.amount && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    borderLeft: '4px solid #f39c12',
                  }}
                >
                  <FaMoneyBillWave
                    style={{ marginRight: '0.5rem', color: '#f39c12' }}
                  />
                  <div>
                    <strong style={{ color: '#2c3e50' }}>Amount:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                      {formatAmount(selectedSession.amount)}
                    </span>
                  </div>
                </div>
              )}

              {selectedSession.notes && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    borderLeft: '4px solid #9b59b6',
                  }}
                >
                  <FaStickyNote
                    style={{
                      marginRight: '0.5rem',
                      color: '#9b59b6',
                      marginTop: '0.2rem',
                    }}
                  />
                  <div>
                    <strong style={{ color: '#2c3e50' }}>Notes:</strong>
                    <p
                      style={{
                        marginLeft: '0.5rem',
                        color: '#7f8c8d',
                        marginTop: '0.5rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {selectedSession.notes}
                    </p>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  borderLeft: '4px solid #27ae60',
                }}
              >
                <div style={{ marginRight: '0.5rem' }}>
                  {getStatusBadge(selectedSession.status)}
                </div>
                <div>
                  <strong style={{ color: '#2c3e50' }}>Status:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                    {selectedSession.status
                      ? selectedSession.status.charAt(0).toUpperCase() +
                        selectedSession.status.slice(1)
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #ecf0f1',
              }}
            >
              <button
                onClick={closeSessionModal}
                style={{
                  padding: '0.8rem 1.5rem',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = '#7f8c8d')
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = '#95a5a6')}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const styles = {
  body: {
    minHeight: '100vh',
    backgroundColor: '#f5f6fa',
    padding: '2rem',
  },
  bookingContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  bookingHeading: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  tabContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    justifyContent: 'center',
  },
  tabButton: {
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#ecf0f1',
    color: '#7f8c8d',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  activeTab: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
    color: '#e74c3c',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #e74c3c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  errorContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    border: '2px solid #e74c3c',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: '#e74c3c',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7f8c8d',
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ecf0f1',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
    gap: '0.5rem',
    fontWeight: 600,
    color: '#2c3e50',
  },
  amount: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#27ae60',
  },
  bookingDetails: {
    marginBottom: '1.5rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    color: '#7f8c8d',
  },
  bookingActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '0.8rem 1.2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
    justifyContent: 'center',
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
  },
  acceptBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
  },
  rejectBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  completeBtn: {
    backgroundColor: '#f39c12',
    color: 'white',
  },
  conductBtn: {
    backgroundColor: '#9b59b6',
    color: 'white',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default CoachBookings;
