import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/verify-email/${token}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Verification failed.');
        } else {
          setMessage(
            data.message || 'Your email has been verified! You can now log in.'
          );
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      }
      setLoading(false);
    };
    verify();
  }, [token, navigate]);

  return (
    <main className='form-page'>
      <h2>Email Verification</h2>
      {loading && <div>Verifying...</div>}
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}
      {message && (
        <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>
      )}
    </main>
  );
}

export default VerifyEmail;
