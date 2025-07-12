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
} from 'react-icons/fa';

function CoachDashboard() {
  const [coachName, setCoachName] = useState('Coach');
  const [coachId, setCoachId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingSessions, setPendingSessions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name && user._id) {
      setCoachName(user.name);
      setCoachId(user._id);
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        Loading coach dashboard...
      </div>
    );
  }
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
            }}
          >
            {stats?.upcomingSessions || 0}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Upcoming Sessions
          </div>
        </div>
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
            }}
          >
            {stats?.avgRating || 'N/A'}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Average Rating
          </div>
        </div>
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
            }}
          >
            {stats?.retention || '0'}%
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Athlete Retention
          </div>
        </div>
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
            }}
          >
            {stats?.newAthletes || 0}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            New Athletes
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
            to='/coach/analytics'
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
            to='/coach/message'
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
                  <FaUser /> {session.athlete}
                </div>
                <div className='time'>{session.time}</div>
                <div className='action-btn'>
                  <Link to='#' className='btn small-btn'>
                    Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </Layout>
  );
}

export default CoachDashboard;
