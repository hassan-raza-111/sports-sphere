import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import '../../css/vendor-profile.css';

const BACKEND_URL = 'http://localhost:5000'; // Change if needed

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
      <div className='vendor-profile-container'>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : profile ? (
          <>
            <div className='profile-header'>
              <img
                src={getImageUrl(profile.image)}
                alt='Vendor Profile Picture'
                id='vendorImage'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/130';
                }}
              />
              <h1>{profile.userId?.name || 'No Name'}</h1>
              <p>{profile.storeName || ''}</p>
              <Link to='/vendor/profile/edit' className='edit-profile-btn'>
                Edit Profile
              </Link>
            </div>
            <div className='info-section'>
              <div className='info-title'>Email</div>
              <div className='info-value'>{profile.userId?.email || ''}</div>
            </div>
            <div className='info-section'>
              <div className='info-title'>Phone</div>
              <div className='info-value'>{profile.userId?.phone || ''}</div>
            </div>
            <div className='info-section'>
              <div className='info-title'>Bio</div>
              <div className='info-value'>{profile.description || ''}</div>
            </div>
            <div className='info-section'>
              <div className='info-title'>Social Links</div>
              <div className='social-icons'>
                {profile.website && (
                  <a
                    href={profile.website}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Website
                  </a>
                )}
                {/* Add more social links if available in schema */}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;
