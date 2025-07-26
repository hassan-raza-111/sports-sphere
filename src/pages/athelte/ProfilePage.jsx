import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config.js';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/profile.css';
import AthleteLayout from '../../components/AthleteLayout';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});

  const [stats, setStats] = useState({
    sessionsCompleted: 0,
    avgCoachRating: 0,
    goalProgress: 0,
    currentBookings: 0,
  });

  const [achievements, setAchievements] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (!user || user.role !== 'athlete') {
      navigate('/login');
      return;
    }

    fetchProfileData(user._id);
  }, [navigate]);

  const fetchProfileData = async (userId) => {
    try {
      setLoading(true);
      setError('');
      const baseUrl = API_BASE_URL;

      // Fetch profile data
      const profileRes = await fetch(`${baseUrl}/users/${userId}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile({
          name: profileData.fullName || profileData.name,
          role: profileData.role,
          sport: profileData.preferredSport,
          location: profileData.location,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio,
          image: profileData.profileImage,
          philosophy: profileData.philosophy,
        });
        setAchievements(
          Array.isArray(profileData.achievements)
            ? profileData.achievements
            : []
        );
        setGoals(Array.isArray(profileData.goals) ? profileData.goals : []);
      }

      // Fetch stats
      const [sessionsRes, ratingRes, progressRes, bookingsRes] =
        await Promise.all([
          fetch(`${baseUrl}/booking/athlete/${userId}/bookings/completed`),
          fetch(`${baseUrl}/feedback/athlete/${userId}/average-rating`),
          fetch(`${baseUrl}/progress/athlete/${userId}/goal-progress`),
          fetch(`${baseUrl}/booking/athlete/${userId}/bookings/upcoming`),
        ]);

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setStats((prev) => ({
          ...prev,
          sessionsCompleted: sessionsData.count || 0,
        }));
      }

      if (ratingRes.ok) {
        const ratingData = await ratingRes.json();
        setStats((prev) => ({
          ...prev,
          avgCoachRating: ratingData.averageRating || 0,
        }));
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setStats((prev) => ({
          ...prev,
          goalProgress: progressData.goalProgress || 0,
        }));
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setStats((prev) => ({
          ...prev,
          currentBookings: bookingsData.count || 0,
        }));
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AthleteLayout>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Loading your profile...</p>
        </div>
      </AthleteLayout>
    );
  }

  return (
    <AthleteLayout>
      <div className='profile-container'>
        {error && <div className='error-message'>{error}</div>}

        {/* Profile Header */}
        <div className='profile-header'>
          <img
            src={profile.image || ''}
            alt='Profile'
            className='profile-image'
          />
          <div className='profile-info'>
            <h2>{profile.name || '-'}</h2>
            <p>
              <i className='fas fa-user'></i> {profile.role || '-'} |{' '}
              {profile.sport || '-'}
            </p>
            <p>
              <i className='fas fa-map-marker-alt'></i>{' '}
              {profile.location || '-'}
            </p>
            <p>
              <i className='fas fa-envelope'></i> {profile.email || '-'}
            </p>
            <p>
              <i className='fas fa-phone'></i> {profile.phone || '-'}
            </p>
            <div className='profile-buttons'>
              <Link to='/athlete/booking' className='btn secondary'>
                <i className='fas fa-calendar'></i> Book Session
              </Link>
              <button
                className='btn secondary'
                onClick={() =>
                  navigator.share({
                    title: `${profile.name || '-'}'s Profile`,
                    url: window.location.href,
                  })
                }
              >
                <i className='fas fa-share-alt'></i> Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* Bio / Stats Section */}
        <div className='profile-section'>
          <h3>
            <i className='fas fa-info-circle'></i> About Me
          </h3>
          <p>{profile.bio || '-'}</p>
          <p>{profile.philosophy || '-'}</p>

          <div className='stat-grid'>
            <div className='stat-box'>
              <h4>{stats.sessionsCompleted}</h4>
              <p>Sessions Completed</p>
            </div>
            <div className='stat-box'>
              <h4>{stats.avgCoachRating.toFixed(1)}</h4>
              <p>Avg Coach Rating</p>
            </div>
            <div className='stat-box'>
              <h4>{stats.goalProgress}%</h4>
              <p>Goal Progress</p>
            </div>
            <div className='stat-box'>
              <h4>{stats.currentBookings}</h4>
              <p>Current Bookings</p>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className='profile-section'>
          <h3>
            <i className='fas fa-trophy'></i> Achievements
          </h3>
          <p>
            {achievements.length === 0 && <span>No achievements yet.</span>}
            {achievements.map((achievement, index) => (
              <span key={index}>
                <strong>
                  {achievement.year ? achievement.year + ' ' : ''}
                  {achievement.title}
                </strong>
                {achievement.description ? ' - ' + achievement.description : ''}
                {index < achievements.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        {/* Goals Section */}
        <div className='profile-section'>
          <h3>
            <i className='fas fa-bullseye'></i> Current Goals
          </h3>
          <p>
            {goals.length === 0 && <span>No goals yet.</span>}
            {goals.map((goal, index) => (
              <span key={index}>
                <i className='fas fa-circle' style={{ color: '#e74c3c' }}></i>{' '}
                {goal.goal}
                {goal.status && (
                  <span style={{ color: '#7f8c8d', fontSize: '0.95em' }}>
                    {' '}
                    ({goal.status}
                    {goal.progress !== undefined ? `, ${goal.progress}%` : ''})
                  </span>
                )}
                {index < goals.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </AthleteLayout>
  );
};

export default ProfilePage;
