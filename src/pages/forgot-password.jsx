import React, { useState } from 'react';
import '../css/login.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to send reset email');
      } else {
        setMessage(
          'If an account with that email exists, a reset link has been sent.'
        );
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <main className='form-page'>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          placeholder='Enter your email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
        )}
        {message && (
          <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>
        )}
        <button type='submit' disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </main>
  );
}

export default ForgotPassword;
