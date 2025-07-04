import React, { useEffect, useState } from 'react';
import logo from '../../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';

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

    fetch(`http://localhost:5000/api/users/${user._id}`)
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
              `http://localhost:5000/api/athlete/${user._id}/bookings/completed`
            ),
            fetch(
              `http://localhost:5000/api/athlete/${user._id}/average-rating`
            ),
            fetch(
              `http://localhost:5000/api/athlete/${user._id}/goal-progress`
            ),
            fetch(
              `http://localhost:5000/api/athlete/${user._id}/bookings/current`
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
      const res = await fetch(`/api/users/${user._id}`, {
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
    );
  if (error)
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
        {error}
      </div>
    );
  if (!profile) return <div>Profile not found.</div>;

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }
        :root {
          --primary-red: #e74c3c;
          --dark-blue: #2c3e50;
          --light-gray: #7f8c8d;
          --off-white: #f8f9fa;
        }
        body {
          color: #333;
          line-height: 1.6;
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
          min-height: 100vh;
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          background-color: rgba(255, 255, 255, 0.95);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-img {
          height: 40px;
          width: auto;
        }
        .logo-text {
          font-size: 1.8rem;
          font-weight: bold;
          color: var(--dark-blue);
          font-style: italic;
        }
        nav {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        nav a {
          font-weight: 600;
          color: var(--dark-blue);
          transition: color 0.3s;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        nav a:hover, nav a.active {
          color: var(--primary-red);
        }
        .notification-badge {
          background-color: var(--primary-red);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 5px;
        }
        .profile-btn {
          background-color: var(--primary-red);
          color: white !important;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        .profile-btn:hover {
          background-color: #c0392b;
        }
        .profile-container {
          max-width: 1000px;
          margin: 140px auto 60px;
          padding: 0 5%;
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
          margin-bottom: 40px;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .profile-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid var(--primary-red);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .profile-info h2 {
          font-size: 2.2rem;
          margin-bottom: 10px;
          color: var(--dark-blue);
        }
        .profile-info p {
          color: var(--light-gray);
          font-size: 1rem;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .profile-buttons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 5px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          color: white;
          background-color: var(--primary-red);
          transition: all 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .btn:hover {
          background-color: #c0392b;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .btn.secondary {
          background-color: transparent;
          border: 2px solid var(--primary-red);
          color: var(--primary-red);
        }
        .btn.secondary:hover {
          background-color: var(--primary-red);
          color: white;
        }
        .profile-section {
          margin-top: 30px;
          background: rgba(255, 255, 255, 0.95);
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .profile-section h3 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: var(--dark-blue);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .profile-section h3 i {
          color: var(--primary-red);
        }
        .profile-section p {
          color: var(--light-gray);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        .stat-box {
          background: var(--off-white);
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s;
          border-left: 4px solid var(--primary-red);
        }
        .stat-box:hover {
          transform: translateY(-5px);
        }
        .stat-box h4 {
          font-size: 2rem;
          color: var(--primary-red);
          margin-bottom: 5px;
        }
        .stat-box p {
          font-size: 0.9rem;
          color: var(--light-gray);
        }
        footer {
          background-color: rgba(44, 62, 80, 0.9);
          color: white;
          padding: 2rem 5%;
          margin-top: 3rem;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-logo {
          font-size: 1.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .copyright {
          font-size: 0.9rem;
        }
      `}</style>

      <header>
        <a href='../index.html' className='logo'>
          <img src={logo} alt='Sport Sphere Logo' className='logo-img' />
          <div className='logo-text'>Sports Sphere</div>
        </a>
        <nav>
          <a href='/athlete'>
            <i className='fas fa-tachometer-alt'></i> Dashboard
          </a>
          <a href='/find-coaches'>
            <i className='fas fa-search'></i> Find Coaches
          </a>
          <a href='/message' className='active'>
            <i className='fas fa-envelope'></i> Messages{' '}
            <span className='notification-badge'>3</span>
          </a>
          <a href='/progress'>
            <i className='fas fa-chart-line'></i> Progress
          </a>
          <a href='/athelte-profile' className='profile-btn'>
            <i className='fas fa-user-tie'></i>
          </a>
        </nav>
      </header>

      <main className='profile-container'>
        <div className='profile-header'>
          <img
            src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            alt='Profile'
            className='profile-image'
          />
          <div className='profile-info'>
            {editMode ? (
              <form
                onSubmit={handleSave}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
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
                  name='location'
                  value={form.location}
                  onChange={handleChange}
                  placeholder='Location'
                />
                <textarea
                  name='about'
                  value={form.about}
                  onChange={handleChange}
                  placeholder='About Me'
                  rows={3}
                />
                <input
                  name='preferredSport'
                  value={form.preferredSport}
                  onChange={handleChange}
                  placeholder='Preferred Sport'
                />
                <input
                  name='level'
                  value={form.level}
                  onChange={handleChange}
                  placeholder='Level'
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div className='profile-buttons'>
                  <button className='btn' type='submit' disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className='btn secondary'
                    type='button'
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2>{profile.name}</h2>
                <p>
                  <i className='fas fa-user'></i>{' '}
                  {profile.role
                    ? `Athlete | ${profile.preferredSport || ''}`
                    : ''}
                </p>
                <p>
                  <i className='fas fa-map-marker-alt'></i>{' '}
                  {profile.location || 'N/A'}
                </p>
                <p>
                  <i className='fas fa-envelope'></i> {profile.email}
                </p>
                <p>
                  <i className='fas fa-phone'></i> {profile.phone || 'N/A'}
                </p>
                <div className='profile-buttons'>
                  <button
                    className='btn secondary'
                    onClick={() => setEditMode(true)}
                  >
                    <i className='fas fa-edit'></i> Edit Profile
                  </button>
                  <a href='/booking' className='btn secondary'>
                    <i className='fas fa-calendar'></i> Book Session
                  </a>
                  <a href='#' className='btn secondary'>
                    <i className='fas fa-share-alt'></i> Share Profile
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        <div className='profile-section'>
          <h3>
            <i className='fas fa-info-circle'></i> About Me
          </h3>
          <p>{profile.about || 'No bio provided.'}</p>
          <div className='stat-grid'>
            <div className='stat-box'>
              <h4>{stats.sessions}</h4>
              <p>Sessions Completed</p>
            </div>
            <div className='stat-box'>
              <h4>{stats.rating}</h4>
              <p>Avg Coach Rating</p>
            </div>
            <div className='stat-box'>
              <h4>{stats.progress}%</h4>
              <p>Goal Progress</p>
            </div>
            <div className='stat-box'>
              <h4>{stats.current}</h4>
              <p>Current Bookings</p>
            </div>
          </div>
        </div>

        <div className='profile-section'>
          <h3>
            <i className='fas fa-trophy'></i> Achievements
          </h3>
          {editMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(form.achievements || []).map((ach, i) => (
                <input
                  key={i}
                  name={`achievements-${i}`}
                  value={ach}
                  onChange={(e) => {
                    const arr = [...form.achievements];
                    arr[i] = e.target.value;
                    setForm((f) => ({ ...f, achievements: arr }));
                  }}
                />
              ))}
              <button
                type='button'
                className='btn secondary'
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    achievements: [...(f.achievements || []), ''],
                  }))
                }
              >
                Add Achievement
              </button>
            </div>
          ) : (
            <ul>
              {(profile.achievements || []).length ? (
                profile.achievements.map((ach, i) => <li key={i}>{ach}</li>)
              ) : (
                <li>No achievements listed.</li>
              )}
            </ul>
          )}
        </div>

        <div className='profile-section'>
          <h3>
            <i className='fas fa-bullseye'></i> Current Goals
          </h3>
          {editMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(form.goals || []).map((goal, i) => (
                <input
                  key={i}
                  name={`goals-${i}`}
                  value={goal}
                  onChange={(e) => {
                    const arr = [...form.goals];
                    arr[i] = e.target.value;
                    setForm((f) => ({ ...f, goals: arr }));
                  }}
                />
              ))}
              <button
                type='button'
                className='btn secondary'
                onClick={() =>
                  setForm((f) => ({ ...f, goals: [...(f.goals || []), ''] }))
                }
              >
                Add Goal
              </button>
            </div>
          ) : (
            <ul>
              {(profile.goals || []).length ? (
                profile.goals.map((goal, i) => <li key={i}>{goal}</li>)
              ) : (
                <li>No goals listed.</li>
              )}
            </ul>
          )}
        </div>
      </main>

      <footer>
        <div className='footer-content'>
          <div className='footer-logo'>
            <i className='fas fa-running'></i> Sport Sphere
          </div>
          <div className='copyright'>
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Profile;
