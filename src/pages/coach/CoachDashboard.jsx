import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import '../../css/coach.css';
import {
  FaChartBar,
  FaComments,
  FaFileAlt,
  FaInbox,
  FaClock,
  FaChalkboardTeacher,
  FaUser,
  FaBell,
  FaCalendarCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStickyNote,
  FaMoneyBillWave,
} from 'react-icons/fa';

function CoachDashboard() {
  const [coachName, setCoachName] = useState('Coach');
  const [coachId, setCoachId] = useState(null); // This will now be the Coach model _id
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get user _id from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name && user._id) {
      setCoachName(user.name);
      // Fetch Coach model _id using user _id
      fetch(`/api/coaches/profile/${user._id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch coach profile');
          return res.json();
        })
        .then((data) => {
          setCoachId(data._id); // Coach model _id
        })
        .catch(() => {
          setError('Failed to load coach profile.');
        });
    }
  }, []);

  useEffect(() => {
    if (!coachId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/coaches/${coachId}/upcoming-sessions`).then((r) => r.json()),
      fetch(`/api/coaches/${coachId}/dashboard-stats`).then((r) => r.json()),
      fetch(`/api/booking/coach/${coachId}/pending`).then((r) => r.json()),
    ])
      .then(([sessionsData, statsData, pendingData]) => {
        setSessions(sessionsData);
        setStats(statsData);
        setPendingSessions(pendingData.bookings || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load dashboard data');
        setLoading(false);
      });
  }, [coachId]);

  const openSessionModal = (session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  const closeSessionModal = () => {
    setShowModal(false);
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

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        {error}
      </div>
    );
  }

  return (
    <Layout role='coach'>
      <h2>
        <FaChalkboardTeacher /> Welcome, {coachName}!
      </h2>

      {/* Pending Sessions Notification */}
      {pendingSessions.length > 0 && (
        <div
          style={{
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            border: '2px solid #ffc107',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaBell style={{ fontSize: '1.5rem', color: '#ffc107' }} />
            <div>
              <h3 style={{ margin: 0, color: '#856404', fontSize: '1.2rem' }}>
                Pending Session Requests
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#856404' }}>
                You have {pendingSessions.length} pending session request(s)
                waiting for your response.
              </p>
            </div>
          </div>
          <Link
            to='/coach/booking'
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: '#ffc107',
              color: '#856404',
              borderRadius: '5px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FaCalendarCheck />
            Review Requests
          </Link>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Upcoming Sessions */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#e74c3c',
              marginBottom: '0.5rem',
              minHeight: '2.5rem',
            }}
          >
            {loading ? (
              <span className='loading-skeleton'>...</span>
            ) : (
              stats?.upcomingSessions ?? 0
            )}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Upcoming Sessions
          </div>
        </div>
        {/* Completed Sessions */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#e74c3c',
              marginBottom: '0.5rem',
              minHeight: '2.5rem',
            }}
          >
            {loading ? (
              <span className='loading-skeleton'>...</span>
            ) : (
              stats?.completedSessions ?? 0
            )}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Completed Sessions
          </div>
        </div>
        {/* Total Athletes */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#e74c3c',
              marginBottom: '0.5rem',
              minHeight: '2.5rem',
            }}
          >
            {loading ? (
              <span className='loading-skeleton'>...</span>
            ) : (
              stats?.totalAthletes ?? 0
            )}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Total Athletes
          </div>
        </div>
        {/* Total Earnings */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#e74c3c',
              marginBottom: '0.5rem',
              minHeight: '2.5rem',
            }}
          >
            {loading ? (
              <span className='loading-skeleton'>...</span>
            ) : (
              `PKR ${stats?.earnings ?? 0}`
            )}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Total Earnings
          </div>
        </div>
        {/* Average Rating */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#e74c3c',
              marginBottom: '0.5rem',
              minHeight: '2.5rem',
            }}
          >
            {loading ? (
              <span className='loading-skeleton'>...</span>
            ) : (
              stats?.avgRating ?? 'N/A'
            )}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Average Rating
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaChartBar
            style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}
          />
          <h3
            style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              marginBottom: '1rem',
            }}
          >
            Analytics
          </h3>
          <p
            style={{
              color: '#7f8c8d',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
            }}
          >
            View detailed analytics and performance metrics.
          </p>
          <Link
            to='/coach/athlete-progress'
            style={{
              display: 'inline-block',
              padding: '0.8rem 1.5rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '5px',
              fontWeight: 600,
              transition: 'background-color 0.3s, transform 0.2s',
              textDecoration: 'none',
            }}
          >
            View Analytics
          </Link>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaComments
            style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}
          />
          <h3
            style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              marginBottom: '1rem',
            }}
          >
            Messages
          </h3>
          <p
            style={{
              color: '#7f8c8d',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
            }}
          >
            Communicate with your athletes and manage conversations.
          </p>
          <Link
            to='/coach/messages'
            style={{
              display: 'inline-block',
              padding: '0.8rem 1.5rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '5px',
              fontWeight: 600,
              transition: 'background-color 0.3s, transform 0.2s',
              textDecoration: 'none',
            }}
          >
            View Messages
          </Link>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaFileAlt
            style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}
          />
          <h3
            style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              marginBottom: '1rem',
            }}
          >
            Session Management
          </h3>
          <p
            style={{
              color: '#7f8c8d',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
            }}
          >
            Manage pending session requests and upcoming bookings.
          </p>
          <Link
            to='/coach/booking'
            style={{
              display: 'inline-block',
              padding: '0.8rem 1.5rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '5px',
              fontWeight: 600,
              transition: 'background-color 0.3s, transform 0.2s',
              textDecoration: 'none',
            }}
          >
            Manage Sessions
          </Link>
        </div>
      </div>

      <section className='sessions-section'>
        <h3>
          <FaClock /> Upcoming Sessions (Next 7 Days)
        </h3>
        <div className='sessions-list'>
          {sessions.length === 0 ? (
            <div
              style={{ color: '#e74c3c', textAlign: 'center', padding: '1rem' }}
            >
              No upcoming sessions found.
            </div>
          ) : (
            sessions.map((session, index) => (
              <div className='session-item' key={index}>
                <div className='date'>
                  {new Date(session.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className='athlete'>
                  <FaUser /> {session.athlete?.name || 'Unknown Athlete'}
                </div>
                <div className='time'>{session.time}</div>
                <div className='action-btn'>
                  <button
                    onClick={() => openSessionModal(session)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = '#c0392b')
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = '#e74c3c')
                    }
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Session Details Modal */}
      {showModal && selectedSession && (
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
                    {selectedSession.athlete?.name || 'Unknown Athlete'}
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

              {selectedSession.location && (
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
                  <FaMapMarkerAlt
                    style={{ marginRight: '0.5rem', color: '#f39c12' }}
                  />
                  <div>
                    <strong style={{ color: '#2c3e50' }}>Location:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                      {selectedSession.location}
                    </span>
                  </div>
                </div>
              )}

              {selectedSession.amount && (
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
                  <FaMoneyBillWave
                    style={{ marginRight: '0.5rem', color: '#27ae60' }}
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

              {selectedSession.status && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    borderLeft: '4px solid #e67e22',
                  }}
                >
                  <div style={{ marginRight: '0.5rem' }}>
                    <span
                      style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        backgroundColor:
                          selectedSession.status === 'completed'
                            ? '#27ae60'
                            : selectedSession.status === 'upcoming'
                            ? '#3498db'
                            : selectedSession.status === 'cancelled'
                            ? '#e74c3c'
                            : '#f39c12',
                        color: 'white',
                      }}
                    >
                      {selectedSession.status}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#2c3e50' }}>Status:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                      {selectedSession.status.charAt(0).toUpperCase() +
                        selectedSession.status.slice(1)}
                    </span>
                  </div>
                </div>
              )}
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
              {selectedSession.status === 'upcoming' && (
                <button
                  style={{
                    padding: '0.8rem 1.5rem',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = '#c0392b')
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = '#e74c3c')
                  }
                >
                  Manage Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default CoachDashboard;
