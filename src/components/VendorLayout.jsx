import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/images/Logo.png';
import {
  FaHome,
  FaStore,
  FaShoppingCart,
  FaMoneyBillWave,
  FaComments,
  FaChartLine,
  FaUser,
  FaSignOutAlt,
  FaCaretDown,
} from 'react-icons/fa';

const VendorLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const isActive = (path) => location.pathname === path;

  // Get user info from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userImage =
    user?.image || 'https://via.placeholder.com/40x40/2c3e50/ffffff?text=U';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
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
            <FaStore /> <span>Products</span>
          </Link>
          <Link
            to='/vendor/orders'
            className={isActive('/vendor/orders') ? 'active' : ''}
          >
            <FaShoppingCart /> <span>Orders</span>
          </Link>
          <Link
            to='/vendor/earnings'
            className={isActive('/vendor/earnings') ? 'active' : ''}
          >
            <FaMoneyBillWave /> <span>Earnings</span>
          </Link>
          <Link
            to='/vendor/feedback-management'
            className={isActive('/vendor/feedback-management') ? 'active' : ''}
          >
            <FaComments /> <span>Feedback</span>
          </Link>
          <Link
            to='/vendor/progress'
            className={isActive('/vendor/progress') ? 'active' : ''}
          >
            <FaChartLine /> <span>Progress</span>
          </Link>

          {/* Profile Dropdown */}
          <div className='profile-dropdown' style={{ position: 'relative' }}>
            <button
              onClick={toggleProfileDropdown}
              className='profile-btn'
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '20px',
                transition: 'background-color 0.3s',
              }}
            >
              <img
                src={userImage}
                alt='Profile'
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <span style={{ fontWeight: 600 }}>{user?.name || 'User'}</span>
              <FaCaretDown />
            </button>

            {showProfileDropdown && (
              <div
                className='dropdown-menu'
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: '180px',
                  zIndex: 1000,
                  marginTop: '5px',
                }}
              >
                <Link
                  to='/vendor/profile'
                  onClick={() => setShowProfileDropdown(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    color: '#333',
                    textDecoration: 'none',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <FaUser />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    handleLogout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    color: '#e74c3c',
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className='' style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer>
        <div className='footer-content'>
          <div className='footer-logo'>
            <FaStore /> Sport Sphere
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
