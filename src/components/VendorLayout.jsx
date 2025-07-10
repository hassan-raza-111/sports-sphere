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
} from 'react-icons/fa';

const VendorLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
          <div className='profile-dropdown'>
            <div
              className='profile-btn'
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <FaUser />
            </div>
            {showProfileMenu && (
              <div className='profile-menu'>
                <Link to='/vendor/profile'>
                  <FaUser /> My Profile
                </Link>
                <button onClick={handleLogout} className='logout-btn'>
                  <FaSignOutAlt /> Logout
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
