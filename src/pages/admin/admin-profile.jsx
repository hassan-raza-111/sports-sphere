import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function AdminProfile() {
  // Dummy: get admin info from localStorage (replace with real API in production)
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Admin',
    email: 'admin@example.com',
  };
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      // Replace with real API call
      await new Promise((res) => setTimeout(res, 1000));
      setMessage('Profile updated successfully!');
      setForm({ ...form, password: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div
        style={{
          maxWidth: 500,
          margin: '60px auto',
          background: 'white',
          borderRadius: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          padding: 32,
        }}
      >
        <h2 style={{ color: '#2c3e50', marginBottom: 24 }}>Admin Profile</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          <label style={{ fontWeight: 600 }}>Name</label>
          <input
            name='name'
            value={form.name}
            onChange={handleChange}
            required
            style={{ padding: 10, borderRadius: 5, border: '1px solid #eee' }}
          />
          <label style={{ fontWeight: 600 }}>Email</label>
          <input
            name='email'
            value={form.email}
            onChange={handleChange}
            required
            type='email'
            style={{ padding: 10, borderRadius: 5, border: '1px solid #eee' }}
          />
          <label style={{ fontWeight: 600 }}>New Password</label>
          <input
            name='password'
            value={form.password}
            onChange={handleChange}
            type='password'
            placeholder='Leave blank to keep current'
            style={{ padding: 10, borderRadius: 5, border: '1px solid #eee' }}
          />
          <label style={{ fontWeight: 600 }}>Confirm Password</label>
          <input
            name='confirmPassword'
            value={form.confirmPassword}
            onChange={handleChange}
            type='password'
            placeholder='Confirm new password'
            style={{ padding: 10, borderRadius: 5, border: '1px solid #eee' }}
          />
          <button
            type='submit'
            disabled={loading}
            style={{
              background: '#e74c3c',
              color: 'white',
              padding: 12,
              border: 'none',
              borderRadius: 5,
              fontWeight: 600,
              marginTop: 10,
            }}
          >
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
          {message && (
            <div style={{ color: 'green', marginTop: 10 }}>{message}</div>
          )}
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminProfile;
