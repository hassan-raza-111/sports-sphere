import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/athlete.css';
import logo from '../../assets/images/Logo.png';
import {
  FaHome,
  FaStore,
  FaEnvelope,
  FaUser,
  FaHandshake,
  FaRunning,
  FaSearch,
  FaCalendar,
  FaChartArea,
} from 'react-icons/fa';

function Athlete() {
  const [athleteName, setAthleteName] = useState('User');
  const [athleteId, setAthleteId] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);

  useEffect(() => {
    // Try to get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name && user._id) {
      setAthleteName(user.name);
      setAthleteId(user._id);
      // Fetch all dynamic stats
      fetch(`/api/athlete/${user._id}/bookings/upcoming`)
        .then((res) => res.json())
        .then((data) => setUpcomingBookings(data.count || 0));
      fetch(`/api/athlete/${user._id}/bookings/completed`)
        .then((res) => res.json())
        .then((data) => setCompletedSessions(data.count || 0));
      fetch(`/api/athlete/${user._id}/average-rating`)
        .then((res) => res.json())
        .then((data) => setAverageRating(data.averageRating || 0));
      fetch(`/api/athlete/${user._id}/goal-progress`)
        .then((res) => res.json())
        .then((data) => setGoalProgress(data.goalProgress || 0));
    }
  }, []);

  return (
    <>
      <header>
        <Link to='/' className='logo'>
          <img src={logo} alt='Sport Sphere Logo' className='logo-img' />
          <div className='logo-text'>Sports Sphere</div>
        </Link>
        <nav>
          <Link to='/athlete' className='active'>
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to='/message'>
            <FaEnvelope />
            <span>Messages</span>
          </Link>
          <Link to='/progress'>
            <FaStore /> <span>Progress</span>
          </Link>
          <Link to='/find-coaches'>
            <FaSearch /> <span>Find Coaches</span>
          </Link>
          <Link to='/athelte-profile' className='profile-btn'>
            <FaUser />
          </Link>
        </nav>
      </header>

      <main className='dashboard'>
        <div className='welcome-banner'>
          <div className='welcome-text'>
            <h2>
              Welcome Back, <span className='athlete-name'>{athleteName}!</span>
            </h2>
            <p>
              Ready for your next training session? You have {upcomingBookings}{' '}
              upcoming bookings.
            </p>
          </div>
          <div className='notification-bell'>
            <FaSearch />
          </div>
        </div>

        <section className='card-container'>
          <div className='dashboard-card booking-card'>
            <div className='card-icon'>
              <FaCalendar />
            </div>
            <h3>My Bookings</h3>
            <p>Manage your upcoming sessions and event registrations</p>
            <Link to='/booking' className='btn'>
              View Schedule
            </Link>
          </div>

          <div className='dashboard-card progress-card'>
            <div className='card-icon'>
              <FaChartArea />
            </div>
            <h3>Progress Tracker</h3>
            <p>Analyze your performance metrics and improvements</p>
            <Link to='/athelte/progress' className='btn secondary'>
              View Analytics
            </Link>
          </div>

          <div className='dashboard-card coach-card'>
            <div className='card-icon'>
              <FaUser />
            </div>
            <h3>Find a Coach</h3>
            <p>Connect with certified coaches in your sport</p>
            <Link to='/athelte/find-coaches' className='btn'>
              Browse Coaches
            </Link>
          </div>
        </section>

        <section className='quick-stats'>
          <h3>
            <i className='fas fa-tachometer-alt'></i> Quick Stats
          </h3>
          <div className='stats-grid'>
            <div className='stat-card'>
              <div className='stat-value'>{completedSessions}</div>
              <div className='stat-label'>Completed Sessions</div>
            </div>
            <div className='stat-card'>
              <div className='stat-value'>{averageRating}</div>
              <div className='stat-label'>Average Rating</div>
            </div>
            <div className='stat-card'>
              <div className='stat-value'>{goalProgress}%</div>
              <div className='stat-label'>Goal Progress</div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className='footer-content'>
          <div className='footer-logo'>
            <i className='fas fa-running'></i> Sport Sphere
          </div>
          <div className='footer-links'>
            <Link to='/athlete'>About Us</Link>
            <Link to='/athlete-profile'>Contact</Link>
            <Link to='#'>Privacy Policy</Link>
            <Link to='/athlete'>Terms of Service</Link>
          </div>
          <div className='social-icons'>
            <a href='#'>
              <i className='fab fa-facebook'></i>
            </a>
            <a href='#'>
              <i className='fab fa-twitter'></i>
            </a>
            <a href='#'>
              <i className='fab fa-instagram'></i>
            </a>
          </div>
        </div>
        <div className='copyright'>
          &copy; 2025 Sport Sphere. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default Athlete;
