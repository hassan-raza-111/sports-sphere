import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/images/Logo.png';
import { FaHome, FaStore, FaEnvelope, FaUser, FaRunning } from 'react-icons/fa';

const VendorLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <header className='vendor-header'>
        <Link to='/' className='logo'>
          <img src={logoImg} alt='Sport Sphere Logo' className='logo-img' />
          <div>
            <div className='logo-text'>Sports Sphere</div>
          </div>
        </Link>
        <nav>
          <Link
            to='/vendor/dashboard'
            className={isActive('/vendor/dashboard') ? 'active' : ''}
          >
            <FaHome /> <span>Dashboard</span>
          </Link>
          <Link
            to='/vendor/panel'
            className={isActive('/vendor/panel') ? 'active' : ''}
          >
            <span>Products</span>
          </Link>
          <Link
            to='/vendor/marketplace'
            className={isActive('/vendor/marketplace') ? 'active' : ''}
          >
            <FaStore /> <span>Marketplace</span>
          </Link>
          <Link
            to='/vendor/messages'
            className={isActive('/vendor/messages') ? 'active' : ''}
          >
            <FaEnvelope /> <span>Messages</span>
          </Link>
          <Link
            to='/vendor/profile'
            className={
              isActive('/vendor/profile') ? 'profile-btn active' : 'profile-btn'
            }
          >
            <FaUser /> <span>Profile</span>
          </Link>
          <Link
            to='/vendor/feedback'
            className={isActive('/vendor/feedback') ? 'active' : ''}
          >
            <span>Feedback</span>
          </Link>
          <Link
            to='/vendor/progress'
            className={isActive('/vendor/progress') ? 'active' : ''}
          >
            <span>Progress</span>
          </Link>
          <Link
            to='/vendor/report'
            className={isActive('/vendor/report') ? 'active' : ''}
          >
            <span>Report</span>
          </Link>
          <button
            onClick={handleLogout}
            className='logout-btn'
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 600,
              marginLeft: '1rem',
            }}
          >
            <FaRunning /> <span>Logout</span>
          </button>
        </nav>
      </header>
      {/* Main Content */}
      <main className='vendors-container' style={{ flex: 1 }}>
        {children}
      </main>
      {/* Footer */}
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
};

export default VendorLayout;
