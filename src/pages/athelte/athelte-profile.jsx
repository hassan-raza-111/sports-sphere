import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config.js';
import { useNavigate } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout.jsx';
import '../../css/athlete-layout.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    sessions: 0,
    rating: 0,
    progress: 0,
    current: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      setError('User not found. Please login again.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    console.log('Fetching profile for user:', user._id);

    fetch(`${API_BASE_URL}/users/${user._id}`)
      .then((res) => {
        console.log('API Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Profile data received:', data);
        setProfile(data);
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          about: data.about || '',
          preferredSport: data.preferredSport || '',
          level: data.level || '',
          achievements: data.achievements || [],
          goals: data.goals || [],
          profileImage: data.profileImage || '',
          age: data.age || '',
          gender: data.gender || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Profile fetch error:', err);
        console.error('User object:', user);
        setError(`Profile fetch failed: ${err.message}`);
        setLoading(false);
      });

    // Fetch stats with better error handling
    const fetchStats = async () => {
      try {
        const [sessionsRes, ratingRes, progressRes, currentRes] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/booking/athlete/${user._id}/bookings/completed`
            ),
            fetch(
              `${API_BASE_URL}/feedback/athlete/${user._id}/average-rating`
            ),
            fetch(`${API_BASE_URL}/progress/athlete/${user._id}/goal-progress`),
            fetch(
              `${API_BASE_URL}/booking/athlete/${user._id}/bookings/current`
            ),
          ]);

        const sessionsData = await sessionsRes.json();
        const ratingData = await ratingRes.json();
        const progressData = await progressRes.json();
        const currentData = await currentRes.json();

        setStats({
          sessions: sessionsData.count || 0,
          rating: ratingData.averageRating || 0,
          progress: progressData.goalProgress || 0,
          current: currentData.count || 0,
        });
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${API_BASE_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setProfile(data.user);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <AthleteLayout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <div className='lds-roller'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <style>{`
        .lds-roller {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }
        .lds-roller div {
          animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          transform-origin: 40px 40px;
        }
        .lds-roller div:after {
          content: " ";
          display: block;
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e74c3c;
          margin: -4px 0 0 -4px;
        }
        .lds-roller div:nth-child(1) { animation-delay: -0.036s; }
        .lds-roller div:nth-child(1):after { top: 63px; left: 63px; }
        .lds-roller div:nth-child(2) { animation-delay: -0.072s; }
        .lds-roller div:nth-child(2):after { top: 68px; left: 56px; }
        .lds-roller div:nth-child(3) { animation-delay: -0.108s; }
        .lds-roller div:nth-child(3):after { top: 71px; left: 48px; }
        .lds-roller div:nth-child(4) { animation-delay: -0.144s; }
        .lds-roller div:nth-child(4):after { top: 72px; left: 40px; }
        .lds-roller div:nth-child(5) { animation-delay: -0.18s; }
        .lds-roller div:nth-child(5):after { top: 71px; left: 32px; }
        .lds-roller div:nth-child(6) { animation-delay: -0.216s; }
        .lds-roller div:nth-child(6):after { top: 68px; left: 24px; }
        .lds-roller div:nth-child(7) { animation-delay: -0.252s; }
        .lds-roller div:nth-child(7):after { top: 63px; left: 17px; }
        .lds-roller div:nth-child(8) { animation-delay: -0.288s; }
        .lds-roller div:nth-child(8):after { top: 56px; left: 12px; }
        @keyframes lds-roller {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `}</style>
        </div>
      </AthleteLayout>
    );

  if (error)
    return (
      <AthleteLayout>
        <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
          {error}
        </div>
      </AthleteLayout>
    );

  if (!profile)
    return (
      <AthleteLayout>
        <div>Profile not found.</div>
      </AthleteLayout>
    );

  return (
    <AthleteLayout>
      {/* Profile Image */}
      {profile?.profileImage && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img
            src={profile.profileImage}
            alt='Profile'
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #e74c3c',
            }}
          />
        </div>
      )}
      {/* Profile Details */}
      <div>
        <strong>Name:</strong> {profile?.name}
        <br />
        <strong>Email:</strong> {profile?.email}
        <br />
        <strong>Phone:</strong> {profile?.phone}
        <br />
        <strong>Location:</strong> {profile?.location}
        <br />
        <strong>About:</strong> {profile?.about}
        <br />
        <strong>Preferred Sport:</strong> {profile?.preferredSport}
        <br />
        <strong>Level:</strong> {profile?.level}
        <br />
        <strong>Achievements:</strong> {profile?.achievements?.join(', ')}
        <br />
        <strong>Goals:</strong> {profile?.goals?.join(', ')}
        <br />
        <strong>Age:</strong> {profile?.age}
        <br />
        <strong>Gender:</strong> {profile?.gender}
        <br />
      </div>
      {/* Edit Form */}
      {editMode && (
        <form onSubmit={handleSave} style={{ marginTop: '2rem' }}>
          <label>
            Profile Image URL:
            <input
              type='text'
              name='profileImage'
              value={form.profileImage}
              onChange={handleChange}
            />
          </label>
          <label>
            Age:
            <input
              type='number'
              name='age'
              value={form.age}
              onChange={handleChange}
            />
          </label>
          <label>
            Gender:
            <select name='gender' value={form.gender} onChange={handleChange}>
              <option value=''>Select</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
          </label>
          <button type='submit'>Save</button>
        </form>
      )}
    </AthleteLayout>
  );
};

export default Profile;
