import React, { useState } from 'react';
import '../css/login.css';
import '../css/index.css';
import logo from '../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirect based on role from API response
      switch (data.user.role) {
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
          setError('Invalid role.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResendMsg(
        data.message ||
          'If your account exists and is not verified, a verification email has been sent.'
      );
    } catch (err) {
      setResendMsg('Server error. Please try again later.');
    }
  };

  return (
    <>
      <header>
        <a href='/' className='logo'>
          <img src={logo} alt='Sport Sphere Logo' className='logo-img' />
          <div className='logo-text'>Sports Sphere</div>
        </a>
        <nav>
          <a href='/register' className='btn secondary'>
            Register
          </a>
        </nav>
      </header>

      <main className='form-page'>
        <h2>Welcome Back!</h2>
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

          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            placeholder='Enter your password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {error}
              {error.includes('invite has been sent') && (
                <>
                  <br />
                  <button
                    type='button'
                    style={{
                      color: 'blue',
                      textDecoration: 'underline',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={handleResend}
                  >
                    Resend verification email
                  </button>
                  {resendMsg && (
                    <div style={{ color: 'green', marginTop: 5 }}>
                      {resendMsg}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <button type='submit'>Login</button>
          <p>
            Don't have an account? <a href='/register'>Sign up</a> or{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </p>
        </form>
      </main>

      <footer>
        <p>&copy; 2025 Sport Sphere | All rights reserved</p>
      </footer>
    </>
  );
}

export default Login;
