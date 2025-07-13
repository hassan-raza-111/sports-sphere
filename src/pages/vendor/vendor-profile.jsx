import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import '../../css/profile.css';

const BACKEND_URL = 'http://localhost:5000';

const VendorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    const user = JSON.parse(userStr);
    const userId = user._id;
    fetch(`/api/vendor-profile/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/130';
    if (img.startsWith('/uploads')) return BACKEND_URL + img;
    return img;
  };

  return (
    <VendorLayout>
      <div className='profile-container'>
        {loading ? (
          <div className='loading-container'>
            <div className='loading-spinner'></div>
            <p>Loading profile...</p>
          </div>
        ) : error ? (
          <div className='error-message'>{error}</div>
        ) : profile ? (
          <>
            {/* Profile Header */}
            <div className='profile-header'>
              <img
                src={getImageUrl(profile.image)}
                alt='Vendor Profile'
                className='profile-image'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/130';
                }}
              />
              <div className='profile-info'>
                <h2>{profile.userId?.name || 'No Name'}</h2>
                <p>
                  <i className='fas fa-store'></i> {profile.storeName || '-'}
                </p>
                <p>
                  <i className='fas fa-envelope'></i>{' '}
                  {profile.userId?.email || '-'}
                </p>
                <p>
                  <i className='fas fa-phone'></i>{' '}
                  {profile.userId?.phone || '-'}
                </p>
                <div className='profile-buttons'>
                  <Link to='/vendor/profile/edit' className='btn'>
                    <i className='fas fa-user-edit'></i> Edit Profile
                  </Link>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='btn secondary'
                    >
                      <i className='fas fa-globe'></i> Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className='profile-section'>
              <h3>
                <i className='fas fa-info-circle'></i> About
              </h3>
              <p>{profile.description || '-'}</p>
            </div>

            {/* Social Section */}
            {(profile.instagram || profile.facebook) && (
              <div className='profile-section'>
                <h3>
                  <i className='fas fa-share-alt'></i> Social Links
                </h3>
                <div className='social-icons'>
                  {profile.instagram && (
                    <a
                      href={profile.instagram}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <i className='fab fa-instagram'></i>
                    </a>
                  )}
                  {profile.facebook && (
                    <a
                      href={profile.facebook}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <i className='fab fa-facebook'></i>
                    </a>
                  )}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;
