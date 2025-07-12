// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import '../../css/coach-profile.css';

export default function CoachProfileEdit() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    sports: '',
    sessionType: '',
    location: '',
    profileImage: '',
    about: '',
    certifications: '',
    specialties: '',
    hourlyRate: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          sports: data.sports || '',
          sessionType: data.sessionType || '',
          location: data.location || '',
          profileImage: data.profileImage || '',
          about: data.about || '',
          certifications: (data.certifications || []).join(', '),
          specialties: (data.specialties || []).join(', '),
          hourlyRate: data.hourlyRate || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await fetch(`/api/coaches/${user._id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          hourlyRate: Number(form.hourlyRate),
          certifications: form.certifications
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          specialties: form.specialties
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setSaving(false);
      navigate('/coach/profile');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        Loading...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        {error}
      </div>
    );

  return (
    <Layout role='coach'>
      <div className='profile-container'>
        <h2>Edit Coach Profile</h2>
        <div style={{ marginBottom: 16, fontWeight: 'bold', color: '#2c3e50' }}>
          Current Session Price: PKR {form.hourlyRate || 0}
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: 500,
          }}
        >
          <input
            name='name'
            value={form.name}
            onChange={handleChange}
            placeholder='Name'
            required
          />
          <input
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='Email'
            required
          />
          <input
            name='phone'
            value={form.phone}
            onChange={handleChange}
            placeholder='Phone'
          />
          <input
            name='sports'
            value={form.sports}
            onChange={handleChange}
            placeholder='Sports (e.g. Tennis, Football)'
          />
          <input
            name='sessionType'
            value={form.sessionType}
            onChange={handleChange}
            placeholder='Session Type (digital, physical, both)'
          />
          <input
            name='location'
            value={form.location}
            onChange={handleChange}
            placeholder='Location'
          />
          <input
            name='profileImage'
            value={form.profileImage}
            onChange={handleChange}
            placeholder='Profile Image URL'
          />
          <label htmlFor='hourlyRate' style={{ fontWeight: 'bold' }}>
            Session Price (PKR)
          </label>
          <input
            name='hourlyRate'
            type='number'
            value={form.hourlyRate}
            onChange={handleChange}
            placeholder='Session Price (PKR)'
            min={0}
            required
          />
          <textarea
            name='about'
            value={form.about}
            onChange={handleChange}
            placeholder='About / Coaching Philosophy'
            rows={3}
          />
          <input
            name='certifications'
            value={form.certifications}
            onChange={handleChange}
            placeholder='Certifications (comma separated)'
          />
          <input
            name='specialties'
            value={form.specialties}
            onChange={handleChange}
            placeholder='Specialties (comma separated)'
          />
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div className='profile-buttons'>
            <button className='btn' type='submit' disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              className='btn secondary'
              type='button'
              onClick={() => navigate('/coach/profile')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
