import React, { useEffect, useState } from 'react';
import '../../css/coach.css';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/Logo.png';
import {
  FaHome,
  FaStore,
  FaEnvelope,
  FaUser,
  FaChartBar,
  FaComments,
  FaFileAlt,
  FaInbox,
  FaClock,
  FaChalkboardTeacher,
  FaRunning,
} from 'react-icons/fa';

function Coach() {
  const [coachName, setCoachName] = useState('Coach');
  const [coachId, setCoachId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    ])
      .then(([sessionsData, statsData]) => {
        setSessions(sessionsData);
        setStats(statsData);
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
    <div>
      <header>
        <Link to='/' className='logo'>
          <img src={logoImg} alt='Sport Sphere Logo' className='logo-img' />
          <div>
            <div className='logo-text'>Sports Sphere</div>
          </div>
        </Link>
        <nav>
          <Link to='/coach' className='active'>
            <FaHome /> <span>Home</span>
          </Link>
          <Link to='/coach/coach-marketplace'>
            <FaStore /> <span>Marketplace</span>
          </Link>
          <Link to='/coach-messages'>
            <FaEnvelope />
            <span>Messages</span>
            <span className='notification-badge'>3</span>
          </Link>
          <Link to='/coach/progress'>
            <FaChartBar /> <span>Coach Progress</span>
          </Link>
          <Link to='/coach-profile' className='profile-btn'>
            <FaUser />
          </Link>
        </nav>
      </header>

      <main className='dashboard'>
        <h2>
          <FaChalkboardTeacher /> Welcome, {coachName}!
        </h2>

        <section className='feature-section card-box'>
          <div className='card'>
            <h3>
              <FaChartBar /> Progress Reports
            </h3>
            <p>
              Monitor athlete performance with detailed analytics and easily
              track their training journey.
            </p>
            <Link to='/progress' className='btn secondary'>
              <FaFileAlt /> View Progress
            </Link>
          </div>

          <div className='card'>
            <h3>
              <FaComments /> Athlete Communication
            </h3>
            <p>
              Stay connected through instant messaging, share training plans,
              and provide session feedback in real time.
            </p>
            <Link to='/message' className='btn primary'>
              <FaInbox /> Go to Messages
            </Link>
          </div>
        </section>

        <section className='sessions-section'>
          <h3>
            <FaClock /> Upcoming Sessions (Next 7 Days)
          </h3>
          <div className='sessions-list'>
            {sessions.length === 0 ? (
              <div
                style={{
                  color: '#e74c3c',
                  textAlign: 'center',
                  padding: '1rem',
                }}
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

        <div className='stats-overview'>
          <div className='stat-card'>
            <div className='value'>{stats?.upcomingSessions ?? '-'}</div>
            <div className='label'>Upcoming Sessions</div>
          </div>
          <div className='stat-card'>
            <div className='value'>{stats?.avgRating ?? '-'}</div>
            <div className='label'>Average Rating</div>
          </div>
          <div className='stat-card'>
            <div className='value'>{stats?.retention ?? '-'}%</div>
            <div className='label'>Athlete Retention</div>
          </div>
          <div className='stat-card'>
            <div className='value'>{stats?.newAthletes ?? '-'}</div>
            <div className='label'>New Athletes</div>
          </div>
        </div>
      </main>

      <footer>
        <div className='footer-content'>
          <div className='footer-logo'>
            <FaRunning /> Sport Sphere
          </div>
          <div className='copyright'>
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Coach;
