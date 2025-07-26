import React, { useRef, useState, useEffect } from 'react';
import VendorLayout from '../../components/VendorLayout';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, BACKEND_URL } from '../../config.js';

export default function VendorProfileForm() {
  const fileInputRef = useRef();
  const previewRef = useRef();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    description: '',
    website: '',
    instagram: '',
    facebook: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    const user = JSON.parse(userStr);
    const userId = user._id;
    fetch(`${API_BASE_URL}/vendor-profile/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.userId?.name || '',
          email: data.userId?.email || '',
          phone: data.userId?.phone || '',
          storeName: data.storeName || '',
          description: data.description || '',
          website: data.website || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          image: data.image || '',
        });
        // If image is a relative path, prepend backend URL
        let img = data.image || '';
        console.log('Image path from backend:', img);
        if (img && img.startsWith('/uploads')) {
          img = BACKEND_URL + img;
        }
        setImagePreview(img || 'https://via.placeholder.com/120');
        console.log(
          'Final imagePreview URL:',
          img || 'https://via.placeholder.com/120'
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // If user clears the file input, revert to previous image or placeholder
      let img = form.image || '';
      if (img && img.startsWith('/uploads')) {
        img = BACKEND_URL + img;
      }
      setImagePreview(img || 'https://via.placeholder.com/120');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    let imagePath = form.image;
    try {
      // Upload image if a new one was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch(
          `${API_BASE_URL}/vendor-profile/upload-image`,
          {
            method: 'POST',
            body: formData,
          }
        );
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        imagePath = uploadData.imagePath;
      }
      // Update User info (name, email, phone)
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const userId = user._id;
      const userRes = await fetch(
        `${API_BASE_URL}/vendor-profile/user/${userId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
          }),
        }
      );
      if (!userRes.ok) throw new Error('User info update failed');
      // Update VendorProfile info
      const res = await fetch(`${API_BASE_URL}/vendor-profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: form.storeName,
          description: form.description,
          website: form.website,
          instagram: form.instagram,
          facebook: form.facebook,
          image: imagePath,
        }),
      });
      if (!res.ok) throw new Error('Profile update failed');
      setSaving(false);
      navigate('/vendor/profile');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <VendorLayout>
      <div className='vendor-profile-form-container'>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <form onSubmit={handleSubmit}>
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
                  src={imagePreview || 'https://via.placeholder.com/120'}
                  alt='Profile Preview'
                  ref={previewRef}
                  style={{ maxWidth: 120, maxHeight: 120, borderRadius: '50%' }}
                />
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='name'>Full Name</label>
              <input
                type='text'
                id='name'
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='phone'>Phone</label>
              <input
                type='tel'
                id='phone'
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='storeName'>Store Name</label>
              <input
                type='text'
                id='storeName'
                value={form.storeName}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='description'>Bio / About You</label>
              <textarea
                id='description'
                rows='4'
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='website'>Website</label>
              <input
                type='url'
                id='website'
                value={form.website}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Social Links (Optional)</label>
              <div className='social-links'>
                <input
                  type='url'
                  id='instagram'
                  placeholder='Instagram URL'
                  value={form.instagram}
                  onChange={handleChange}
                />
                <input
                  type='url'
                  id='facebook'
                  placeholder='Facebook URL'
                  value={form.facebook}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type='submit' disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        )}
      </div>
    </VendorLayout>
  );
}
