import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import '../../css/coach-profile.css';
import {
  FaCertificate,
  FaUserTie,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUserEdit,
  FaChartLine,
  FaCalendarPlus,
  FaInfoCircle,
  FaStar,
  FaComments,
} from 'react-icons/fa';

const CoachProfile = () => {
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      setError('Coach not found');
      setLoading(false);
      return;
    }
    fetch(`/api/coaches/${user._id}/profile`)
      .then((res) => res.json())
      .then((data) => {
        setCoach(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        Loading profile...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        {error}
      </div>
    );
  if (!coach) return null;

  return (
    <Layout role='coach'>
      <div className='profile-container'>
        {/* Profile Header */}
        <div className='profile-header'>
          <img
            src={
              coach.profileImage ||
              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            }
            alt='Coach Profile'
            className='profile-image'
          />
          <div className='profile-info'>
            <h2>
              {coach.name || 'Coach Name'}{' '}
              <span className='certification-badge'>
                <FaCertificate /> Certified
              </span>
            </h2>
            <div
              style={{ fontWeight: 'bold', color: '#e74c3c', marginBottom: 8 }}
            >
              Session Price: PKR {coach.hourlyRate || 0}
            </div>
            <p>
              <FaUserTie /> Professional {coach.sports || 'Coach'}
            </p>
            <p>
              <FaMapMarkerAlt /> {coach.location || 'Location not set'}
            </p>
            <p>
              <FaEnvelope /> {coach.email || 'Email not set'}
            </p>
            <p>
              <FaPhone /> {coach.phone || 'Phone not set'}
            </p>
            <div className='profile-buttons'>
              <Link to='/coach/profile/edit' className='btn'>
                <FaUserEdit /> Edit Profile
              </Link>
              <Link to='/coach/athlete-progress' className='btn secondary'>
                <FaChartLine /> View Analytics
              </Link>
              <Link to='/coach/booking' className='btn secondary'>
                <FaCalendarPlus /> Add Availability
              </Link>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className='profile-section'>
          <h3>
            <FaInfoCircle /> Coaching Philosophy
          </h3>
          <p>{coach.about || 'No coaching philosophy provided yet.'}</p>
          {coach.certifications && coach.certifications.length > 0 && (
            <p style={{ marginTop: 10 }}>
              <strong>Certifications:</strong> {coach.certifications.join(', ')}
            </p>
          )}
          <div className='stat-grid'>
            <div className='stat-box'>
              <h4>{coach.stats?.athletesTrained ?? '-'}</h4>
              <p>Athletes Trained</p>
            </div>
            <div className='stat-box'>
              <h4>{coach.stats?.avgRating ?? '-'}</h4>
              <p>Avg. Rating</p>
            </div>
            <div className='stat-box'>
              <h4>{coach.stats?.retentionRate ?? '-'}%</h4>
              <p>Retention Rate</p>
            </div>
            <div className='stat-box'>
              <h4>{coach.stats?.sessionsThisMonth ?? '-'}</h4>
              <p>Sessions This Month</p>
            </div>
          </div>
        </div>

        {/* Specialties Section */}
        <div className='profile-section'>
          <h3>
            <FaStar /> Specialties
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 15,
            }}
          >
            {coach.specialties && coach.specialties.length > 0 ? (
              coach.specialties.map((spec, i) => (
                <span
                  key={i}
                  style={{
                    background: 'var(--primary-red)',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: 20,
                    fontSize: '0.9rem',
                  }}
                >
                  {spec}
                </span>
              ))
            ) : (
              <span style={{ color: 'var(--light-gray)' }}>
                No specialties listed.
              </span>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        <div className='profile-section feedback-section'>
          <h3>
            <FaComments /> Athlete Testimonials
          </h3>
          {coach.testimonials && coach.testimonials.length > 0 ? (
            coach.testimonials.map((t, i) => (
              <div className='testimonial' key={i}>
                <strong>{t.athlete}</strong>
                <div className='rating'>
                  {[...Array(Math.floor(t.rating))].map((_, idx) => (
                    <i
                      key={idx}
                      className='fas fa-star'
                      style={{ color: '#f1c40f' }}
                    ></i>
                  ))}
                  {t.rating % 1 !== 0 && (
                    <i
                      className='fas fa-star-half-alt'
                      style={{ color: '#f1c40f' }}
                    ></i>
                  )}
                </div>
                {t.feedbackText}
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--light-gray)' }}>
              No testimonials yet.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CoachProfile;
