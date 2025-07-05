import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user._id) {
      // User is logged in, redirect to their dashboard based on role
      switch (user.role) {
        case 'athlete':
          navigate('/athlete/dashboard');
          break;
        case 'coach':
          navigate('/coach/dashboard');
          break;
        case 'vendor':
          navigate('/vendor/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          // If role is not recognized, clear localStorage and stay on current page
          localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  // If user is not logged in, show the children (public pages)
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user._id) {
    return children;
  }

  // If user is logged in, show loading while redirecting
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#2c3e50',
      }}
    >
      Redirecting to your dashboard...
    </div>
  );
};

export default ProtectedRoute;
