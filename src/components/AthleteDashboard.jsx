import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config.js';

const AthleteDashboard = () => {
  const [athleteName, setAthleteName] = useState('Loading...');
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'athlete') {
      navigate('/login');
      return;
    }

    setAthleteName(user.fullName || user.name || 'Athlete');
    fetchAthleteData(user._id);
  }, [navigate]);

  const fetchAthleteData = async (userId) => {
    try {
      setLoading(true);
      setError('');
      const baseUrl = API_BASE_URL;

      // Fetch only essential data
      const [
        upcomingBookingsRes,
        completedSessionsRes,
        averageRatingRes,
        goalProgressRes,
      ] = await Promise.all([
        fetch(`${baseUrl}/booking/athlete/${userId}/bookings/upcoming`),
        fetch(`${baseUrl}/booking/athlete/${userId}/bookings/completed`),
        fetch(`${baseUrl}/feedback/athlete/${userId}/average-rating`),
        fetch(`${baseUrl}/progress/athlete/${userId}/goal-progress`),
      ]);

      // Handle responses with error checking
      if (upcomingBookingsRes.ok) {
        const data = await upcomingBookingsRes.json();
        setUpcomingBookings(data.count || 0);
      } else {
        console.error('Failed to fetch upcoming bookings');
        setUpcomingBookings(0);
      }

      if (completedSessionsRes.ok) {
        const data = await completedSessionsRes.json();
        setCompletedSessions(data.count || 0);
      } else {
        console.error('Failed to fetch completed sessions');
        setCompletedSessions(0);
      }

      if (averageRatingRes.ok) {
        const data = await averageRatingRes.json();
        setAverageRating(data.averageRating || 0);
      } else {
        console.error('Failed to fetch average rating');
        setAverageRating(0);
      }

      if (goalProgressRes.ok) {
        const data = await goalProgressRes.json();
        setGoalProgress(data.goalProgress || 0);
      } else {
        console.error('Failed to fetch goal progress');
        setGoalProgress(0);
      }
    } catch (err) {
      console.error('Error fetching athlete data:', err);
      setError('Failed to load dashboard data. Please try again.');
      // Set fallback data
      setUpcomingBookings(0);
      setCompletedSessions(0);
      setAverageRating(0);
      setGoalProgress(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className='dashboard'>
      {error && <div className='error-message'>{error}</div>}

      <div className='welcome-banner'>
        <div className='welcome-text'>
          <h2>
            Welcome Back, <span className='athlete-name'>{athleteName}</span>!
          </h2>
          <p>
            Ready for your next training session? You have {upcomingBookings}{' '}
            upcoming {upcomingBookings === 1 ? 'booking' : 'bookings'}.
          </p>
        </div>
        <div className='notification-bell'>
          <i className='fas fa-bell'></i>
        </div>
      </div>

      <section className='card-container'>
        <div className='dashboard-card booking-card'>
          <div className='card-icon'>
            <i className='fas fa-calendar-check'></i>
          </div>
          <h3>My Bookings</h3>
          <p>Manage your upcoming sessions and event registrations</p>
          <Link to='/athlete/booking' className='btn'>
            View Schedule
          </Link>
        </div>

        <div className='dashboard-card progress-card'>
          <div className='card-icon'>
            <i className='fas fa-chart-bar'></i>
          </div>
          <h3>Progress Tracker</h3>
          <p>Analyze your performance metrics and improvements</p>
          <Link to='/athlete/progress' className='btn secondary'>
            View Analytics
          </Link>
        </div>

        <div className='dashboard-card coach-card'>
          <div className='card-icon'>
            <i className='fas fa-user-tie'></i>
          </div>
          <h3>Find a Coach</h3>
          <p>Connect with certified coaches in your sport</p>
          <Link to='/athlete/find-coaches' className='btn'>
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
            <div className='stat-value'>{averageRating.toFixed(1)}</div>
            <div className='stat-label'>Average Rating</div>
          </div>
          <div className='stat-card'>
            <div className='stat-value'>{goalProgress}%</div>
            <div className='stat-label'>Goal Progress</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AthleteDashboard;
