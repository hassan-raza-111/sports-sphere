import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/images/Logo.png';
import {
  FaRunning,
  FaUserTie,
  FaEnvelope,
  FaStore,
  FaHome,
  FaChartLine,
  FaSignOutAlt,
} from 'react-icons/fa';

const Layout = ({ children, role = 'coach' }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  // You can expand role-based nav if needed
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
          {role === 'coach' && (
            <>
              <Link to='/coach/dashboard' className='active'>
                <FaHome /> <span>Home</span>
              </Link>
              <Link to='/coach/marketplace'>
                <FaStore /> <span>Marketplace</span>
              </Link>
              <Link to='/coach/messages'>
                <FaEnvelope /> <span>Messages</span>
                <span className='notification-badge'>3</span>
              </Link>
              <Link to='/coach/athlete-progress'>
                <FaChartLine /> <span>Coach Progress</span>
              </Link>
              <Link to='/coach/profile' className='profile-btn'>
                <FaUserTie />
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
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </>
          )}
          {/* Add nav for other roles as needed */}
        </nav>
      </header>
      <main className='dashboard'>{children}</main>
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

export default Layout;
