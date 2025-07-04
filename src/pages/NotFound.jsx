import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
    }}
  >
    <h1 style={{ fontSize: '4rem', color: '#e74c3c', marginBottom: '1rem' }}>
      404
    </h1>
    <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Page Not Found</h2>
    <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
      Sorry, the page you are looking for does not exist.
    </p>
    <Link
      to='/'
      style={{
        color: '#fff',
        background: '#e74c3c',
        padding: '0.7rem 2rem',
        borderRadius: 5,
        textDecoration: 'none',
        fontWeight: 600,
      }}
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;
