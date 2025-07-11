import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUserShield,
  FaMoneyBillWave,
  FaFlag,
  FaRunning,
  FaUsers,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaUniversity,
} from 'react-icons/fa';
import logoImg from '../assets/images/Logo.png';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80") no-repeat center center/cover',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 5%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Link
          to='/admin/dashboard'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <img
            src={logoImg}
            alt='Sport Sphere Logo'
            style={{ height: '40px', width: 'auto' }}
          />
          <div>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#2c3e50',
                fontStyle: 'italic',
              }}
            >
              Sports Sphere
            </div>
          </div>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link
            to='/admin/dashboard'
            style={{
              fontWeight: 600,
              color: isActive('/admin/dashboard') ? '#e74c3c' : '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaUserShield /> <span>Admin</span>
            <span
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                marginLeft: '0.5rem',
              }}
            >
              ADMIN
            </span>
          </Link>
          <Link
            to='/admin/payment-management'
            style={{
              fontWeight: 600,
              color: isActive('/admin/payment-management')
                ? '#e74c3c'
                : '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaMoneyBillWave /> <span>Payments</span>
          </Link>
          <Link
            to='/admin/payouts'
            style={{
              fontWeight: 600,
              color: isActive('/admin/payouts') ? '#e74c3c' : '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaUniversity /> <span>Payouts</span>
          </Link>
          <Link
            to='/admin/user-management'
            style={{
              fontWeight: 600,
              color: isActive('/admin/user-management') ? '#e74c3c' : '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaUsers /> <span>Users</span>
          </Link>
          <Link
            to='/admin/report'
            style={{
              fontWeight: 600,
              color: isActive('/admin/report') ? '#e74c3c' : '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaFlag /> <span>Reports</span>
            <span
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '5px',
              }}
            >
              5
            </span>
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
                <Link to='/admin/profile'>
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
      <main
        style={{
          padding: '140px 5% 60px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'rgba(44, 62, 80, 0.9)',
          color: 'white',
          padding: '2rem 5%',
          marginTop: '3rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FaRunning /> Sport Sphere
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            &copy; 2025 Sport Sphere. Admin Panel v2.4.1
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
