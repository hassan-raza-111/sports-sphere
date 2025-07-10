import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/Logo.png';

const AthleteLayout = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <header>
        <Link to='/athlete/dashboard' className='logo'>
          <img src={logo} alt='Sport Sphere Logo' className='logo-img' />
          <div>
            <div className='logo-text'>Sports Sphere</div>
          </div>
        </Link>
        <nav>
          <Link
            to='/athlete/dashboard'
            className={
              location.pathname === '/athlete/dashboard' ? 'active' : ''
            }
          >
            <i className='fas fa-home'></i> <span>Home</span>
          </Link>
          <Link
            to='/athlete/messages'
            className={
              location.pathname === '/athlete/messages' ? 'active' : ''
            }
          >
            <i className='fas fa-envelope'></i> <span>Messages</span>
          </Link>
          <Link
            to='/athlete/progress'
            className={
              location.pathname === '/athlete/progress' ? 'active' : ''
            }
          >
            <i className='fas fa-chart-line'></i> <span>Progress</span>
          </Link>
          <Link
            to='/athlete/find-coaches'
            className={
              location.pathname === '/athlete/find-coaches' ? 'active' : ''
            }
          >
            <i className='fas fa-search'></i> <span>Find Coaches</span>
          </Link>
          <Link
            to='/athlete/marketplace'
            className={
              location.pathname === '/athlete/marketplace' ? 'active' : ''
            }
          >
            <i className='fas fa-store'></i> <span>Marketplace</span>
          </Link>
          <div className='profile-dropdown'>
            <div
              className='profile-btn'
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <i className='fas fa-user'></i>
            </div>
            {showProfileMenu && (
              <div className='profile-menu'>
                <Link to='/athlete/profile'>
                  <i className='fas fa-user-circle'></i> My Profile
                </Link>
                <button onClick={handleLogout} className='logout-btn'>
                  <i className='fas fa-sign-out-alt'></i> Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className='athlete-main'>{children}</main>

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

export default AthleteLayout;
