import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaStar,
  FaUser,
  FaCalendarCheck,
  FaMedal,
  FaRunning,
} from 'react-icons/fa';

const FindCoaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedRating, setSelectedRating] = useState('');
  const [availableToday, setAvailableToday] = useState(false);

  const sports = [
    'All Sports',
    'Tennis',
    'Football',
    'Basketball',
    'Swimming',
    'Cricket',
    'Badminton',
  ];

  useEffect(() => {
    fetchCoaches();
  }, [searchTerm, selectedSport, selectedRating, availableToday]);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedSport !== 'All Sports') params.append('sport', selectedSport);
      if (selectedRating) params.append('rating', selectedRating);
      if (availableToday) params.append('available', 'true');

      const response = await fetch(`/api/coaches/find?${params}`);
      const data = await response.json();
      setCoaches(data);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} style={{ color: '#e74c3c' }} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key='half' style={{ color: '#e74c3c' }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} style={{ color: '#ddd' }} />);
    }

    return stars;
  };

  const getDefaultImage = (sport) => {
    const sportImages = {
      Tennis:
        'https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      Football:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      Basketball:
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      Swimming:
        'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    };
    return (
      sportImages[sport] ||
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80") no-repeat center center/cover',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 5%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Link
          to='/'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <img
            src='/src/assets/images/Logo.png'
            alt='Sport Sphere Logo'
            style={{ height: '40px', width: 'auto' }}
          />
          <div>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#2c3e50',
                fontStyle: 'italic',
              }}
            >
              Sports Sphere
            </div>
          </div>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link
            to='/'
            style={{
              fontWeight: 600,
              color: '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaRunning /> <span>Home</span>
          </Link>
          <Link
            to='/athlete/dashboard'
            style={{
              fontWeight: 600,
              color: '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaUser /> <span>Dashboard</span>
          </Link>
          <Link
            to='/athlete/messages'
            style={{
              fontWeight: 600,
              color: '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaUser /> <span>Messages</span>
            <span
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '5px',
              }}
            >
              3
            </span>
          </Link>
          <Link
            to='/athlete/profile'
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s',
            }}
          >
            <FaUser />
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main
        style={{
          padding: '140px 5% 60px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: '2.2rem',
            color: 'white',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
          }}
        >
          <FaSearch /> Find Your Perfect Coach
        </h2>

        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            marginBottom: '2rem',
            maxWidth: '800px',
          }}
        >
          <FaSearch
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#7f8c8d',
            }}
          />
          <input
            type='text'
            placeholder='Search by sport, name or location...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem 0.8rem 3rem',
              border: '2px solid #e1e5eb',
              borderRadius: '5px',
              fontSize: '1rem',
              transition: 'all 0.3s',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          />
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.8rem',
            marginBottom: '2rem',
          }}
        >
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              style={{
                padding: '0.5rem 1.2rem',
                backgroundColor:
                  selectedSport === sport
                    ? '#e74c3c'
                    : 'rgba(255, 255, 255, 0.95)',
                color: selectedSport === sport ? 'white' : '#2c3e50',
                border: '2px solid #e1e5eb',
                borderRadius: '20px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {sport}
            </button>
          ))}
          <button
            onClick={() =>
              setSelectedRating(selectedRating === '4.5' ? '' : '4.5')
            }
            style={{
              padding: '0.5rem 1.2rem',
              backgroundColor:
                selectedRating === '4.5'
                  ? '#e74c3c'
                  : 'rgba(255, 255, 255, 0.95)',
              color: selectedRating === '4.5' ? 'white' : '#2c3e50',
              border: '2px solid #e1e5eb',
              borderRadius: '20px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            4.5+ Rating
          </button>
          <button
            onClick={() => setAvailableToday(!availableToday)}
            style={{
              padding: '0.5rem 1.2rem',
              backgroundColor: availableToday
                ? '#e74c3c'
                : 'rgba(255, 255, 255, 0.95)',
              color: availableToday ? 'white' : '#2c3e50',
              border: '2px solid #e1e5eb',
              borderRadius: '20px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            Available Today
          </button>
        </div>

        {/* Coaches Grid */}
        {loading ? (
          <div
            style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem' }}
          >
            Loading coaches...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {coaches.map((coach) => (
              <div
                key={coach._id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s',
                  borderLeft: '4px solid #e74c3c',
                }}
              >
                <div
                  style={{
                    height: '200px',
                    backgroundImage: `url(${
                      coach.profileImage || getDefaultImage(coach.sports)
                    })`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      color: '#2c3e50',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {coach.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#7f8c8d',
                      marginBottom: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    <FaMedal />
                    <span>{coach.sports} Coach</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ color: '#e74c3c' }}>
                      {renderStars(coach.rating)}
                    </div>
                    <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                      {coach.rating} ({coach.reviewCount} reviews)
                    </span>
                  </div>
                  <p
                    style={{
                      color: '#7f8c8d',
                      marginBottom: '1.5rem',
                      lineHeight: '1.6',
                    }}
                  >
                    {coach.about ||
                      `${coach.experience} years of experience in ${
                        coach.sports
                      }. Specializes in ${
                        coach.specialties?.join(', ') || 'general training'
                      }.`}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link
                      to={`/coach/profile/${coach._id}`}
                      style={{
                        display: 'inline-block',
                        padding: '0.6rem 1.2rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        borderRadius: '5px',
                        fontWeight: 600,
                        transition: 'background-color 0.3s, transform 0.2s',
                        textDecoration: 'none',
                      }}
                    >
                      <FaUser /> View Profile
                    </Link>
                    <Link
                      to={`/booking/${coach._id}`}
                      style={{
                        display: 'inline-block',
                        padding: '0.6rem 1.2rem',
                        backgroundColor: 'transparent',
                        border: '2px solid #e74c3c',
                        color: '#e74c3c',
                        borderRadius: '5px',
                        fontWeight: 600,
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                      }}
                    >
                      <FaCalendarCheck /> Book Session
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && coaches.length === 0 && (
          <div
            style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem' }}
          >
            No coaches found matching your criteria.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'rgba(44, 62, 80, 0.9)',
          color: 'white',
          padding: '2rem 5%',
          marginTop: '3rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FaRunning /> Sport Sphere
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FindCoaches;
