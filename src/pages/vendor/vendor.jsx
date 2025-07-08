import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/vendor.css';
import logoImg from '../../assets/images/Logo.png';
import {
  FaHome,
  FaStore,
  FaEnvelope,
  FaUser,
  FaHandshake,
  FaRunning,
} from 'react-icons/fa';

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/vendor-profile');
        if (!res.ok) throw new Error('Failed to fetch vendors');
        const data = await res.json();
        setVendors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <>
      <header>
        <Link to='/' className='logo'>
          <img src={logoImg} alt='Sport Sphere Logo' className='logo-img' />
          <div>
            <div className='logo-text'>Sports Sphere</div>
          </div>
        </Link>
        <nav>
          <Link to='/'>
            <FaHome /> <span>Home</span>
          </Link>
          <Link to='/marketplace' className='active'>
            <FaStore /> <span>Marketplace</span>
          </Link>
          <Link to='/message'>
            <FaEnvelope /> <span>Messages</span>
          </Link>
          <Link to='/vendor-profile' className='profile-btn'>
            <FaUser />
          </Link>
        </nav>
      </header>

      <main className='vendors-container'>
        <h2 className='vendors-heading'>
          <FaHandshake /> Featured Vendors
        </h2>
        {loading ? (
          <div
            style={{ color: 'white', textAlign: 'center', margin: '2rem 0' }}
          >
            Loading vendors...
          </div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', margin: '2rem 0' }}>
            {error}
          </div>
        ) : (
          <div className='vendor-grid'>
            {vendors.map((vendor, index) => (
              <div className='vendor-card' key={vendor._id || index}>
                <img
                  src={
                    vendor.image?.startsWith('http')
                      ? vendor.image
                      : vendor.image?.replace('/assets', '/src/assets')
                  }
                  alt={vendor.storeName}
                />
                <h3>{vendor.storeName}</h3>
                <p>{vendor.description}</p>
                <a
                  href={vendor.website}
                  className='btn'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Visit Store
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

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
    </>
  );
}
