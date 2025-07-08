import React, { useRef } from 'react';
import VendorLayout from '../../components/VendorLayout';

export default function VendorProfileForm() {
  const fileInputRef = useRef();
  const previewRef = useRef();

  // For now, just preview image locally
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        previewRef.current.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <VendorLayout>
      <div className='vendor-profile-form-container'>
        <h1>Update Profile</h1>
        <form>
          <div className='profile-picture'>
            <input
              type='file'
              accept='image/*'
              id='profileImage'
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <div id='imagePreview'>
              <img
                src='https://via.placeholder.com/120'
                alt='Profile Preview'
                ref={previewRef}
              />
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='vendorName'>Full Name</label>
            <input
              type='text'
              id='vendorName'
              defaultValue='Alex Johnson'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='vendorEmail'>Email</label>
            <input
              type='email'
              id='vendorEmail'
              defaultValue='alex@example.com'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='vendorPhone'>Phone</label>
            <input
              type='tel'
              id='vendorPhone'
              defaultValue='+1 555-123-4567'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='storeName'>Store Name</label>
            <input
              type='text'
              id='storeName'
              defaultValue={"Alex's Athletics"}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='vendorBio'>Bio / About You</label>
            <textarea
              id='vendorBio'
              rows='4'
              defaultValue='Passionate about quality athletic gear, serving the sports community since 2010.'
              required
            />
          </div>
          <div className='form-group'>
            <label>Social Links (Optional)</label>
            <div className='social-links'>
              <input
                type='url'
                id='instagram'
                placeholder='Instagram URL'
                defaultValue='https://instagram.com/yourprofile'
              />
              <input
                type='url'
                id='facebook'
                placeholder='Facebook URL'
                defaultValue='https://facebook.com/yourprofile'
              />
            </div>
          </div>
          <button type='button'>Save Profile</button>
        </form>
      </div>
    </VendorLayout>
  );
}
