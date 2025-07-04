// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/index.css';
import logo from '../assets/images/Logo.png';
function Home() {
  return (
    <>
      <header>
        <Link to='/' className='logo'>
          <img src={logo} alt='Sport Sphere Logo' className='logo-img' />
          <div className='logo-text'>Sport Sphere</div>
        </Link>
        <nav>
          <Link to='/login'>Login</Link> {/* ✅ This now uses React Router */}
          <Link to='/register'>Sign Up</Link>
          <Link to='/find-coaches'>Find Coaches</Link>
          <a href='#about'>About</a>
        </nav>
      </header>

      <section className='hero'>
        <h2>Train Smarter. Play Harder.</h2>
        <p>
          Connect with professional coaches, track your progress, and explore
          verified sports gear.
        </p>
        <div className='cta-buttons'>
          <Link to='/find-coaches' className='btn primary'>
            Find Coaches
          </Link>
          <Link to='/login?role=athlete' className='btn secondary'>
            Join as Athlete
          </Link>
          <Link to='/login?role=coach' className='btn tertiary'>
            Become a Coach
          </Link>
          <Link to='/login?role=vendor' className='btn secondary'>
            Join as Vendor
          </Link>
          <Link to='/login?role=admin' className='btn secondary'>
            Join as Admin
          </Link>
        </div>
      </section>

      <section className='info-section' id='about'>
        <h3>Why Choose Sport Sphere?</h3>
        <ul>
          <li>Personalized coaching sessions with certified professionals</li>
          <li>Real-time progress tracking with advanced analytics</li>
          <li>Secure payment processing and encrypted messaging</li>
          <li>Authentic sports gear marketplace with verified vendors</li>
          <li>Comprehensive athlete development programs</li>
          <li>Flexible scheduling and session management</li>
        </ul>
      </section>

      <footer>
        <p>&copy; 2025 Sport Sphere | All rights reserved</p>
      </footer>
    </>
  );
}

export default Home;
