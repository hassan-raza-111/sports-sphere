import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AthleteLayout from '../components/AthleteLayout';
import '../css/profile.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'Loading...',
    role: 'Athlete',
    sport: 'Football',
    location: 'Los Angeles, CA',
    email: 'loading@email.com',
    phone: '(555) 123-4567',
    bio: 'Professional athlete with competitive experience...',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  });

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
      const baseUrl = 'http://localhost:5000/api';

      // Fetch profile data
      const profileRes = await fetch(`${baseUrl}/users/${userId}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile({
          name: profileData.fullName || profileData.name || 'Athlete',
          role: profileData.role || 'Athlete',
          sport: profileData.preferredSport || 'Football',
          location: profileData.location || 'Los Angeles, CA',
          email: profileData.email || 'athlete@email.com',
          phone: profileData.phone || '(555) 123-4567',
          bio:
            profileData.bio ||
            'Professional athlete with competitive experience. Specializing in offensive strategies and endurance training.',
          image:
            profileData.profileImage ||
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        });
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

      // Fetch achievements (mock data for now)
      setAchievements([
        {
          year: '2024',
          title: 'National Championships',
          description: '1st Place Offensive Player',
        },
        {
          year: '2023',
          title: 'Regional Tournament',
          description: 'MVP Award',
        },
        {
          year: '2022',
          title: 'Collegiate League',
          description: 'All-Star Team Selection',
        },
        {
          year: '2021',
          title: 'State Championships',
          description: 'Top Scorer Award',
        },
      ]);

      // Fetch goals (mock data for now)
      setGoals([
        'Improve 40-yard dash time by 0.3 seconds (in progress)',
        'Increase vertical jump by 4 inches (in progress)',
        'Reduce recovery time between sprints by 15%',
        'Master 3 new offensive plays',
      ]);
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
          <img src={profile.image} alt='Profile' className='profile-image' />
          <div className='profile-info'>
            <h2>{profile.name}</h2>
            <p>
              <i className='fas fa-user'></i> {profile.role} | {profile.sport}
            </p>
            <p>
              <i className='fas fa-map-marker-alt'></i> {profile.location}
            </p>
            <p>
              <i className='fas fa-envelope'></i> {profile.email}
            </p>
            <p>
              <i className='fas fa-phone'></i> {profile.phone}
            </p>
            <div className='profile-buttons'>
              <Link to='/athlete/booking' className='btn secondary'>
                <i className='fas fa-calendar'></i> Book Session
              </Link>
              <button
                className='btn secondary'
                onClick={() =>
                  navigator.share({
                    title: `${profile.name}'s Profile`,
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
          <p>{profile.bio}</p>
          <p>
            My training philosophy focuses on consistent improvement through
            measurable goals, data-driven performance analysis, and
            collaborative coaching relationships. I believe in balancing intense
            physical training with mental preparation and recovery.
          </p>

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
            {achievements.map((achievement, index) => (
              <span key={index}>
                <strong>
                  {achievement.year} {achievement.title}
                </strong>{' '}
                - {achievement.description}
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
            {goals.map((goal, index) => (
              <span key={index}>
                <i className='fas fa-circle' style={{ color: '#e74c3c' }}></i>{' '}
                {goal}
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
