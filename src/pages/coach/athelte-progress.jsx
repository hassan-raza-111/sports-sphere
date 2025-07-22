import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Line } from 'react-chartjs-2';
import {
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaTrophy,
  FaRunning,
  FaHeartbeat,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaTachometerAlt,
  FaTimes,
  FaClock,
  FaMapMarkerAlt,
  FaStickyNote,
  FaEye,
  FaStar,
} from 'react-icons/fa';
import '../../css/coach-athlete-progress.css';

const timeframes = [
  { key: 'month', label: '1M' },
  { key: 'quarter', label: '3M' },
  { key: 'half', label: '6M' },
  { key: 'year', label: '1Y' },
];
const sessionTimeframes = [
  { key: 'month', label: '1M' },
  { key: 'quarter', label: '3M' },
  { key: 'year', label: '1Y' },
  { key: 'all', label: 'All' },
];

const CoachAthleteProgress = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionFilter, setSessionFilter] = useState('quarter');
  const [athleteSearch, setAthleteSearch] = useState('');
  const [coachId, setCoachId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  // Add new analytics state
  const [athleteStats, setAthleteStats] = useState(null);
  const [latestMetrics, setLatestMetrics] = useState(null);

  // Get user _id from localStorage and fetch Coach model _id
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
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

  // Fetch athletes for this specific coach
  useEffect(() => {
    if (!coachId) return;
    setLoading(true);
    fetch(`/api/progress/athletes?coachId=${coachId}`)
      .then((res) => res.json())
      .then((data) => {
        setAthletes(data);
        setSelectedAthlete(
          (prev) => prev || (data.length > 0 ? data[0] : null)
        );
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load athletes');
        setLoading(false);
      });
  }, [coachId]);

  // Only fetch session data for selected athlete
  useEffect(() => {
    if (!selectedAthlete) return;
    setSessionsLoading(true);
    setError(null);
    fetch(
      `/api/progress/athletes/${selectedAthlete._id}/sessions?coachId=${coachId}&timeframe=${sessionFilter}`
    )
      .then((r) => r.json())
      .then((sessionsData) => {
        setSessions(sessionsData || []);
        setSessionsLoading(false);
      })
      .catch(() => {
        setError('Failed to load athlete session data');
        setSessionsLoading(false);
      });
  }, [selectedAthlete, sessionFilter, coachId]);

  // Calculate athlete stats whenever sessions change
  useEffect(() => {
    if (!sessions || sessions.length === 0) {
      setAthleteStats(null);
      return;
    }
    const totalSessions = sessions.length;
    const attended = sessions.filter((s) => s.status === 'completed').length;
    const missed = sessions.filter((s) => s.status === 'missed').length;
    const attendanceRate =
      totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;
    // Average performance (if available)
    const perfValues = sessions
      .map((s) => parseFloat(s.performance))
      .filter((v) => !isNaN(v));
    const avgPerformance =
      perfValues.length > 0
        ? (perfValues.reduce((a, b) => a + b, 0) / perfValues.length).toFixed(1)
        : 'N/A';
    // Most frequent focus area
    const focusAreas = sessions.map((s) => s.focusArea).filter(Boolean);
    const focusAreaCount = {};
    focusAreas.forEach((area) => {
      focusAreaCount[area] = (focusAreaCount[area] || 0) + 1;
    });
    let mostFrequentFocus = 'N/A';
    let maxCount = 0;
    Object.entries(focusAreaCount).forEach(([area, count]) => {
      if (count > maxCount) {
        mostFrequentFocus = area;
        maxCount = count;
      }
    });
    setAthleteStats({
      totalSessions,
      attended,
      missed,
      attendanceRate,
      avgPerformance,
      mostFrequentFocus,
    });
  }, [sessions]);

  // Fetch latest metrics for selected athlete
  useEffect(() => {
    if (!selectedAthlete) return;
    console.log('Fetching metrics for athlete:', selectedAthlete._id);
    fetch(`/api/progress/athlete/${selectedAthlete._id}/metrics-summary`)
      .then((res) => {
        console.log('Metrics response status:', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('Metrics data received:', data);
        setLatestMetrics(data);
      })
      .catch((err) => {
        console.error('Error fetching metrics:', err);
        setLatestMetrics(null);
      });
  }, [selectedAthlete]);

  const openSessionModal = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const closeSessionModal = () => {
    setShowSessionModal(false);
    setSelectedSession(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (timeStr) => {
    return timeStr || 'N/A';
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      completed: '#27ae60',
      upcoming: '#3498db',
      missed: '#e74c3c',
      cancelled: '#95a5a6',
      pending: '#f39c12',
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
        {status || 'unknown'}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout role='coach'>
        <div
          style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}
        >
          Loading athlete progress...
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout role='coach'>
        <div
          style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}
        >
          {error}
        </div>
      </Layout>
    );
  }
  if (!athletes.length) {
    return (
      <Layout role='coach'>
        <div
          style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}
        >
          No athletes found in the system.
        </div>
      </Layout>
    );
  }

  // Chart.js data
  const chartData = null; // No chart data to display

  return (
    <Layout role='coach'>
      <div className='analytics-container'>
        <h2 className='analytics-heading'>
          <FaChartLine /> Athlete Progress Analysis
        </h2>
        {/* Show latest metrics for selected athlete */}
        {latestMetrics && (
          <div
            className='metrics-summary-grid'
            style={{
              display: 'flex',
              gap: '2rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              {
                label: 'Stamina',
                value: latestMetrics.stamina,
                color: '#e74c3c',
                icon: <FaRunning style={{ color: '#e74c3c', fontSize: 22 }} />,
              },
              {
                label: 'Speed',
                value: latestMetrics.speed,
                color: '#3498db',
                icon: <FaArrowUp style={{ color: '#3498db', fontSize: 22 }} />,
              },
              {
                label: 'Strength',
                value: latestMetrics.strength,
                color: '#2ecc71',
                icon: <FaTrophy style={{ color: '#2ecc71', fontSize: 22 }} />,
              },
              {
                label: 'Focus',
                value: latestMetrics.focus,
                color: '#f39c12',
                icon: (
                  <FaHeartbeat style={{ color: '#f39c12', fontSize: 22 }} />
                ),
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className='metrics-summary-card'
                style={{
                  background: '#f8f9fa',
                  borderRadius: 10,
                  padding: '1.2rem 2rem',
                  minWidth: 180,
                  textAlign: 'center',
                  borderLeft: `4px solid ${metric.color}`,
                }}
              >
                {metric.icon}
                <h4 style={{ margin: '0.5rem 0 0.2rem' }}>
                  {metric.value} / 100
                </h4>
                <div
                  style={{
                    width: '100%',
                    background: '#eee',
                    borderRadius: 6,
                    height: 16,
                    margin: '0.5rem 0 0.2rem',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, metric.value)}%`,
                      background: metric.color,
                      height: '100%',
                    }}
                  ></div>
                </div>
                <p style={{ margin: 0, color: '#7f8c8d' }}>{metric.label}</p>
              </div>
            ))}
          </div>
        )}
        {/* Athlete Selector */}
        <div className='athlete-selector'>
          <div className='athlete-selector-header'>
            <h3 className='athlete-selector-title'>
              <FaUsers /> Select Athlete
            </h3>
            <div className='search-athlete'>
              <i className='fas fa-search'></i>
              <input
                type='text'
                placeholder='Search athlete...'
                value={athleteSearch}
                onChange={(e) => setAthleteSearch(e.target.value)}
              />
            </div>
          </div>
          <div className='athlete-grid'>
            {athletes
              .filter((a) =>
                a.name.toLowerCase().includes(athleteSearch.toLowerCase())
              )
              .map((athlete) => (
                <div
                  key={athlete._id}
                  className={`athlete-card${
                    selectedAthlete && selectedAthlete._id === athlete._id
                      ? ' active'
                      : ''
                  }`}
                  onClick={() => setSelectedAthlete(athlete)}
                >
                  <img
                    src={
                      athlete.profileImage ||
                      'https://randomuser.me/api/portraits/men/32.jpg'
                    }
                    alt={athlete.name}
                    className='athlete-avatar'
                  />
                  <div className='athlete-info'>
                    <h4>{athlete.name}</h4>
                    <p>{athlete.sport}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* Athlete Stats Analytics */}
        {athleteStats && (
          <div className='analytics-grid'>
            <div className='analytics-card'>
              <FaCalendarCheck />
              <h4>{athleteStats.totalSessions}</h4>
              <p>Total Sessions</p>
            </div>
            <div className='analytics-card'>
              <FaCalendarCheck style={{ color: '#27ae60' }} />
              <h4>{athleteStats.attended}</h4>
              <p>Sessions Attended</p>
            </div>
            <div className='analytics-card'>
              <FaCalendarCheck style={{ color: '#e74c3c' }} />
              <h4>{athleteStats.missed}</h4>
              <p>Sessions Missed</p>
            </div>
            <div className='analytics-card'>
              <FaHeartbeat />
              <h4>{athleteStats.attendanceRate}%</h4>
              <p>Attendance Rate</p>
            </div>
            <div className='analytics-card'>
              <FaStar />
              <h4>{athleteStats.avgPerformance}</h4>
              <p>Average Performance</p>
            </div>
            <div className='analytics-card'>
              <FaTachometerAlt />
              <h4>{athleteStats.mostFrequentFocus}</h4>
              <p>Most Frequent Focus Area</p>
            </div>
          </div>
        )}
        {/* Overview Cards removed */}
        {/* Key Performance Metrics Section removed */}
        {/* Session History */}
        <div className='chart-section'>
          <div className='chart-header'>
            <h3 className='chart-title'>
              <FaHistory /> Session History
            </h3>
            <div className='time-selector'>
              {sessionTimeframes.map((tf) => (
                <button
                  key={tf.key}
                  className={`time-btn${
                    sessionFilter === tf.key ? ' active' : ''
                  }`}
                  onClick={() => setSessionFilter(tf.key)}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {sessionsLoading ? (
            <div
              style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #e74c3c',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem',
                }}
              ></div>
              Loading sessions...
            </div>
          ) : (
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Focus Area</th>
                  <th>Performance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions && sessions.length > 0 ? (
                  sessions.map((session, idx) => (
                    <tr key={idx}>
                      <td>{new Date(session.date).toLocaleDateString()}</td>
                      <td>{formatTime(session.time)}</td>
                      <td>{session.duration || 'N/A'}</td>
                      <td>{session.focusArea || 'N/A'}</td>
                      <td>
                        {session.performance ? (
                          <>
                            <i
                              className='fas fa-star'
                              style={{ color: '#f1c40f' }}
                            ></i>{' '}
                            {session.performance}
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{getStatusBadge(session.status)}</td>
                      <td>
                        <button
                          onClick={() => openSessionModal(session)}
                          style={{
                            padding: '0.3rem 0.6rem',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = '#2980b9')
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = '#3498db')
                          }
                        >
                          <FaEye /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: 'center',
                        color: '#e74c3c',
                        padding: '2rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <FaHistory style={{ fontSize: '2rem', opacity: 0.5 }} />
                        <p style={{ margin: 0 }}>No session data available</p>
                        <small style={{ opacity: 0.7 }}>
                          Sessions will appear here once they are completed
                        </small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
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
                <FaHistory
                  style={{ marginRight: '0.5rem', color: '#e74c3c' }}
                />
                Session Details
              </h2>
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                Complete session information for {selectedAthlete?.name}
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
                <FaCalendarCheck
                  style={{ marginRight: '0.5rem', color: '#e74c3c' }}
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
                  borderLeft: '4px solid #3498db',
                }}
              >
                <FaClock style={{ marginRight: '0.5rem', color: '#3498db' }} />
                <div>
                  <strong style={{ color: '#2c3e50' }}>Time:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                    {formatTime(selectedSession.time)}
                  </span>
                </div>
              </div>

              {selectedSession.duration && (
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
                  <FaClock
                    style={{ marginRight: '0.5rem', color: '#2ecc71' }}
                  />
                  <div>
                    <strong style={{ color: '#2c3e50' }}>Duration:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                      {selectedSession.duration}
                    </span>
                  </div>
                </div>
              )}

              {selectedSession.focusArea && (
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
                  <FaTrophy
                    style={{ marginRight: '0.5rem', color: '#f39c12' }}
                  />
                  <div>
                    <strong style={{ color: '#2c3e50' }}>Focus Area:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                      {selectedSession.focusArea}
                    </span>
                  </div>
                </div>
              )}

              {selectedSession.performance && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    borderLeft: '4px solid #9b59b6',
                  }}
                >
                  <FaStar style={{ marginRight: '0.5rem', color: '#9b59b6' }} />
                  <div>
                    <strong style={{ color: '#2c3e50' }}>Performance:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#7f8c8d' }}>
                      <i
                        className='fas fa-star'
                        style={{ color: '#f1c40f' }}
                      ></i>{' '}
                      {selectedSession.performance}
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
                    borderLeft: '4px solid #e67e22',
                  }}
                >
                  <FaStickyNote
                    style={{
                      marginRight: '0.5rem',
                      color: '#e67e22',
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

export default CoachAthleteProgress;
