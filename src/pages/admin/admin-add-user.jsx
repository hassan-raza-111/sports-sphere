import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { API_BASE_URL } from '../../config.js';

const initialState = {
  name: '',
  email: '',
  password: '',
  role: '',
  status: 'active',
  // Coach
  sports: '',
  sessionType: '',
  location: '',
  // Athlete
  preferredSport: '',
  level: '',
  // Vendor
  storeName: '',
  vendorType: '',
  website: '',
};

const SPORTS = [
  'Tennis',
  'Football',
  'Basketball',
  'Swimming',
  'Boxing',
  'Athletics',
  'Yoga',
  'Cricket',
  'Hockey',
  'Volleyball',
  'Table Tennis',
  'Badminton',
  'Rugby',
  'Other',
];

const AdminAddUser = () => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/users/admin-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to add user');
        setLoading(false);
        return;
      }
      navigate('/admin/user-management');
    } catch (err) {
      setError('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div
        style={{
          maxWidth: 500,
          margin: '0 auto',
          background: 'white',
          borderRadius: 8,
          padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ marginBottom: 24 }}>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Name</label>
            <input
              name='name'
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Role</label>
            <select
              name='role'
              value={form.role}
              onChange={handleRoleChange}
              required
              style={{
                width: '100%',
                padding: 8,
                marginTop: 4,
                background: '#fff',
                border: '1.5px solid #ccc',
                color: form.role ? '#222' : '#888',
              }}
            >
              <option value='' disabled hidden>
                Select a Role
              </option>
              <option value='coach'>Coach</option>
              <option value='athlete'>Athlete</option>
              <option value='vendor'>Vendor</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          {/* Coach Specific Fields */}
          {form.role === 'coach' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label>Sports You Coach</label>
                <select
                  name='sports'
                  value={form.sports}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                >
                  <option value=''>Select Sport</option>
                  {SPORTS.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Session Type</label>
                <select
                  name='sessionType'
                  value={form.sessionType}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                >
                  <option value=''>Select</option>
                  <option value='digital'>Digital</option>
                  <option value='physical'>Physical</option>
                  <option value='both'>Both</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Preferred Location (for physical sessions)</label>
                <input
                  name='location'
                  value={form.location}
                  onChange={handleChange}
                  placeholder='City, Venue, etc.'
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
            </>
          )}
          {/* Athlete Specific Fields */}
          {form.role === 'athlete' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label>Preferred Sport</label>
                <input
                  name='preferredSport'
                  value={form.preferredSport}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Skill Level</label>
                <select
                  name='level'
                  value={form.level}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                >
                  <option value=''>Select</option>
                  <option value='beginner'>Beginner</option>
                  <option value='intermediate'>Intermediate</option>
                  <option value='advanced'>Advanced</option>
                </select>
              </div>
            </>
          )}
          {/* Vendor Specific Fields */}
          {form.role === 'vendor' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label>Store Name</label>
                <input
                  name='storeName'
                  value={form.storeName}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Vendor Type</label>
                <select
                  name='vendorType'
                  value={form.vendorType}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                >
                  <option value=''>Select</option>
                  <option value='marketplace'>Sell Items on Marketplace</option>
                  <option value='integration'>Connect Entire Store</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Store Website (for integration)</label>
                <input
                  name='website'
                  value={form.website}
                  onChange={handleChange}
                  placeholder='https://example.com'
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
            </>
          )}
          {/* Status (for all roles) */}
          <div style={{ marginBottom: 12 }}>
            <label>Status</label>
            <select
              name='status'
              value={form.status}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            >
              <option value='active'>Active</option>
              <option value='suspended'>Suspended</option>
              <option value='pending'>Pending</option>
            </select>
          </div>
          {error && (
            <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              type='button'
              className='btn secondary'
              onClick={() => navigate('/admin/user-management')}
              disabled={loading}
              style={{
                background: '#fff',
                color: '#e74c3c',
                border: '2px solid #e74c3c',
                borderRadius: 5,
                fontWeight: 600,
                padding: '0.6rem 1.5rem',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e74c3c';
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#fff';
                e.target.style.color = '#e74c3c';
              }}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn'
              disabled={loading}
              style={{
                background: '#e74c3c',
                color: '#fff',
                border: '2px solid #e74c3c',
                borderRadius: 5,
                fontWeight: 600,
                padding: '0.6rem 1.5rem',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#c0392b';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#e74c3c';
              }}
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAddUser;
