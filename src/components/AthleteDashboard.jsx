import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.png';

const AthleteDashboard = () => {
  const [athleteName, setAthleteName] = useState('Loading...');
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);
  const [quickStats, setQuickStats] = useState({
    totalSessions: 0,
    thisMonth: 0,
    nextSession: null,
    achievements: 0,
  });
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
      const baseUrl = 'http://localhost:5000/api';

      // Fetch all data in parallel for better performance
      const [
        upcomingBookingsRes,
        completedSessionsRes,
        averageRatingRes,
        goalProgressRes,
        notificationsRes,
        recentBookingsRes,
        quickStatsRes,
      ] = await Promise.all([
        fetch(`${baseUrl}/booking/athlete/${userId}/bookings/upcoming`),
        fetch(`${baseUrl}/booking/athlete/${userId}/bookings/completed`),
        fetch(`${baseUrl}/feedback/athlete/${userId}/average-rating`),
        fetch(`${baseUrl}/progress/athlete/${userId}/goal-progress`),
        fetch(`${baseUrl}/notifications/athlete/${userId}`),
        fetch(`${baseUrl}/booking/athlete/${userId}/recent`),
        fetch(`${baseUrl}/progress/athlete/${userId}/overview`),
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

      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications');
        setNotifications([]);
      }

      if (recentBookingsRes.ok) {
        const data = await recentBookingsRes.json();
        setRecentBookings(data.bookings || []);
      } else {
        console.error('Failed to fetch recent bookings');
        setRecentBookings([]);
      }

      if (quickStatsRes.ok) {
        const data = await quickStatsRes.json();
        setQuickStats({
          totalSessions: data.completedSessions || 0,
          thisMonth: data.trendSessions || 0,
          nextSession: data.nextSession || null,
          achievements: data.achievements || 0,
        });
      } else {
        console.error('Failed to fetch quick stats');
        setQuickStats({
          totalSessions: 0,
          thisMonth: 0,
          nextSession: null,
          achievements: 0,
        });
      }
    } catch (err) {
      console.error('Error fetching athlete data:', err);
      setError('Failed to load dashboard data. Please try again.');
      // Set fallback data
      setUpcomingBookings(0);
      setCompletedSessions(0);
      setAverageRating(0);
      setGoalProgress(0);
      setNotifications([]);
      setRecentBookings([]);
      setQuickStats({
        totalSessions: 0,
        thisMonth: 0,
        nextSession: null,
        achievements: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    <>
      <header>
        <Link to='/' className='logo'>
          <img src={logo} alt='Sport Sphere Logo' className='logo-img' />
          <div>
            <div className='logo-text'>Sports Sphere</div>
          </div>
        </Link>
        <nav>
          <Link to='/athlete' className='active'>
            <i className='fas fa-home'></i> <span>Home</span>
          </Link>
          <Link to='/message'>
            <i className='fas fa-envelope'></i> <span>Messages</span>
          </Link>
          <Link to='/progress'>
            <i className='fas fa-chart-line'></i> <span>Progress</span>
          </Link>
          <Link to='/find-coaches'>
            <i className='fas fa-search'></i> <span>Find Coaches</span>
          </Link>

          {/* Dynamic Notifications */}
          <div className='notification-container'>
            <div
              className='notification-bell'
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className='fas fa-bell'></i>
              {unreadNotificationsCount > 0 && (
                <span className='notification-badge'>
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            {showNotifications && (
              <div className='notifications-dropdown'>
                <h4>Notifications ({notifications.length})</h4>
                {notifications.length === 0 ? (
                  <p>No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`notification-item ${
                        !notification.read ? 'unread' : ''
                      }`}
                      onClick={() => markNotificationAsRead(notification._id)}
                    >
                      <p>{notification.message}</p>
                      <small>{formatDate(notification.createdAt)}</small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className='profile-dropdown'>
            <div className='profile-btn'>
              <i className='fas fa-user'></i>
            </div>
            <div className='profile-menu'>
              <Link to='/athlete-profile'>
                <i className='fas fa-user'></i> Profile
              </Link>
              <Link to='/settings'>
                <i className='fas fa-cog'></i> Settings
              </Link>
              <button onClick={handleLogout} className='logout-btn'>
                <i className='fas fa-sign-out-alt'></i> Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className='dashboard'>
        {error && <div className='error-message'>{error}</div>}

        <div className='welcome-banner'>
          <div className='welcome-text'>
            <h2>
              Welcome Back, <span className='athlete-name'>{athleteName}</span>!
            </h2>
            <p>
              Ready for your next training session? You have {upcomingBookings}{' '}
              upcoming {upcomingBookings === 1 ? 'booking' : 'bookings'}.
              {quickStats.nextSession &&
                ` Next session: ${formatDate(quickStats.nextSession)}`}
            </p>
          </div>
          <div className='quick-actions'>
            <Link to='/booking' className='btn secondary'>
              <i className='fas fa-calendar'></i> View Schedule
            </Link>
          </div>
        </div>

        <section className='card-container'>
          <div className='dashboard-card booking-card'>
            <div className='card-icon'>
              <i className='fas fa-calendar-check'></i>
            </div>
            <h3>My Bookings</h3>
            <p>Manage your upcoming sessions and event registrations</p>
            <div className='card-stats'>
              <span className='stat-number'>{upcomingBookings}</span>
              <span className='stat-label'>Upcoming</span>
            </div>
            <Link to='/booking' className='btn'>
              View Schedule
            </Link>
          </div>

          <div className='dashboard-card progress-card'>
            <div className='card-icon'>
              <i className='fas fa-chart-bar'></i>
            </div>
            <h3>Progress Tracker</h3>
            <p>Analyze your performance metrics and improvements</p>
            <div className='card-stats'>
              <span className='stat-number'>{goalProgress}%</span>
              <span className='stat-label'>Goal Progress</span>
            </div>
            <Link to='/progress' className='btn secondary'>
              View Analytics
            </Link>
          </div>

          <div className='dashboard-card coach-card'>
            <div className='card-icon'>
              <i className='fas fa-user-tie'></i>
            </div>
            <h3>Find a Coach</h3>
            <p>Connect with certified coaches in your sport</p>
            <div className='card-stats'>
              <span className='stat-number'>{averageRating.toFixed(1)}</span>
              <span className='stat-label'>Avg Rating</span>
            </div>
            <Link to='/find-coaches' className='btn'>
              Browse Coaches
            </Link>
          </div>

          <div className='dashboard-card marketplace-card'>
            <div className='card-icon'>
              <i className='fas fa-store'></i>
            </div>
            <h3>Marketplace</h3>
            <p>Shop for sports equipment and gear</p>
            <div className='card-stats'>
              <span className='stat-number'>New</span>
              <span className='stat-label'>Products</span>
            </div>
            <Link to='/marketplace' className='btn secondary'>
              Shop Now
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
            <div className='stat-card'>
              <div className='stat-value'>{upcomingBookings}</div>
              <div className='stat-label'>Upcoming Sessions</div>
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className='recent-activity'>
          <h3>
            <i className='fas fa-clock'></i> Recent Activity
          </h3>
          <div className='activity-list'>
            {completedSessions > 0 ? (
              <div className='activity-item'>
                <div className='activity-icon'>
                  <i className='fas fa-calendar'></i>
                </div>
                <div className='activity-content'>
                  <p>Completed your latest training session</p>
                  <small>Great progress on your goals!</small>
                </div>
              </div>
            ) : (
              <div className='activity-item'>
                <div className='activity-icon'>
                  <i className='fas fa-running'></i>
                </div>
                <div className='activity-content'>
                  <p>Welcome to Sports Sphere!</p>
                  <small>
                    Start your fitness journey by booking your first session
                  </small>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Sessions */}
        {recentBookings.length > 0 && (
          <section className='upcoming-sessions'>
            <h3>
              <i className='fas fa-calendar'></i> Upcoming Sessions
            </h3>
            <div className='sessions-list'>
              {recentBookings.slice(0, 3).map((booking, index) => (
                <div key={index} className='session-item'>
                  <div className='session-time'>
                    <span className='date'>{formatDate(booking.date)}</span>
                    <span className='time'>{booking.time}</span>
                  </div>
                  <div className='session-details'>
                    <h4>Session with {booking.coachName || 'Coach'}</h4>
                    <p>{booking.notes || 'No additional notes'}</p>
                  </div>
                  <div className='session-actions'>
                    <Link to={`/booking/${booking._id}`} className='btn small'>
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer>
        <div className='footer-content'>
          <div className='footer-logo'>
            <i className='fas fa-running'></i> Sport Sphere
          </div>
          <div className='footer-links'>
            <Link to='#'>About Us</Link>
            <Link to='#'>Contact</Link>
            <Link to='#'>Privacy Policy</Link>
            <Link to='#'>Terms of Service</Link>
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
};

export default AthleteDashboard;
