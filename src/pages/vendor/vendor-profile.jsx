import React from 'react';
import { Link } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';

const VendorProfile = () => {
  return (
    <VendorLayout>
      <div className='vendor-profile-container'>
        <div className='profile-header'>
          <img
            src='https://via.placeholder.com/130'
            alt='Vendor Profile Picture'
          />
          <h1>Alex Johnson</h1>
          <p>Alex's Athletics</p>
          <Link to='/vendor/profile/edit' className='edit-profile-btn'>
            Edit Profile
          </Link>
        </div>
        <div className='info-section'>
          <div className='info-title'>Email</div>
          <div className='info-value'>alex@example.com</div>
        </div>
        <div className='info-section'>
          <div className='info-title'>Phone</div>
          <div className='info-value'>+1 555-123-4567</div>
        </div>
        <div className='info-section'>
          <div className='info-title'>Bio</div>
          <div className='info-value'>
            Passionate about quality athletic gear, serving the sports community
            since 2010.
          </div>
        </div>
        <div className='info-section'>
          <div className='info-title'>Social Links</div>
          <div className='social-icons'>
            <a
              href='https://instagram.com/yourprofile'
              target='_blank'
              rel='noopener noreferrer'
            >
              Instagram
            </a>
            <a
              href='https://facebook.com/yourprofile'
              target='_blank'
              rel='noopener noreferrer'
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;
