import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config.js';
import '../css/login.css';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to reset password');
      } else {
        setMessage('Password has been reset. You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <main className='form-page'>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='password'>New Password</label>
        <input
          type='password'
          id='password'
          placeholder='Enter new password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor='confirm'>Confirm Password</label>
        <input
          type='password'
          id='confirm'
          placeholder='Confirm new password'
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
        )}
        {message && (
          <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>
        )}
        <button type='submit' disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </main>
  );
}

export default ResetPassword;
