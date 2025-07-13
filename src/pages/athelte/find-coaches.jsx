import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/find-coaches.css';
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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedRating, setSelectedRating] = useState('');
  const [availableToday, setAvailableToday] = useState(false);
  const navigate = useNavigate();

  // Debounced API call for all filters and search
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        fetchCoaches();
      },
      searchTerm ? 400 : 0
    ); // Debounce only if searchTerm is not empty

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSport, selectedRating, availableToday]);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedSport !== 'All Sports') params.append('sport', selectedSport);
      if (selectedRating) params.append('rating', selectedRating);
      if (availableToday) params.append('available', 'true');

      const response = await fetch(
        `http://localhost:5000/api/coaches/find?${params}`
      );
      const data = await response.json();
      setCoaches(Array.isArray(data) ? data : data.coaches || []);
    } catch (err) {
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (stars, rating) => {
    // If stars array is not provided, generate from rating
    if (!stars) {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5 ? 1 : 0;
      const emptyStars = 5 - fullStars - halfStar;
      stars = [
        ...Array(fullStars).fill(1),
        ...Array(halfStar).fill(0.5),
        ...Array(emptyStars).fill(0),
      ];
    }
    return stars.map((val, i) => {
      if (val === 1) {
        return <FaStar key={i} style={{ color: '#e74c3c' }} />;
      } else if (val === 0.5) {
        return <FaStar key={i} style={{ color: '#e74c3c' }} />;
      } else {
        return <FaStar key={i} style={{ color: '#ddd' }} />;
      }
    });
  };

  const sports = [
    'All Sports',
    'Tennis',
    'Football',
    'Basketball',
    'Swimming',
    '4.5+ Rating',
    'Available Today',
  ];

  const handleFilterClick = (filter) => {
    if (filter === 'All Sports') {
      setSelectedSport('All Sports');
    } else if (filter === '4.5+ Rating') {
      setSelectedRating(selectedRating === '4.5' ? '' : '4.5');
    } else if (filter === 'Available Today') {
      setAvailableToday(!availableToday);
    } else {
      setSelectedSport(filter);
    }
  };

  const isFilterActive = (filter) => {
    if (filter === 'All Sports') {
      return selectedSport === 'All Sports';
    } else if (filter === '4.5+ Rating') {
      return selectedRating === '4.5';
    } else if (filter === 'Available Today') {
      return availableToday;
    } else {
      return selectedSport === filter;
    }
  };

  const handleViewProfile = (coachId) => {
    // Route should match the actual coach profile route
    navigate(`/coach/profile/${coachId}`);
  };

  const handleBookSession = (coachId) => {
    // Route should match the actual booking route for athlete
    navigate(`/athlete/booking/${coachId}`);
  };

  // Filter coaches based on search and filters (if needed)
  const filteredCoaches = coaches.filter((coach) => {
    // Search filter (optional, since backend handles it)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        coach.name?.toLowerCase().includes(searchLower) ||
        coach.specialty?.toLowerCase().includes(searchLower) ||
        coach.bio?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    // Sport filter (optional, since backend handles it)
    if (selectedSport !== 'All Sports') {
      const coachSport = coach.specialty?.toLowerCase() || '';
      const selectedSportLower = selectedSport.toLowerCase();
      if (!coachSport.includes(selectedSportLower)) return false;
    }
    // Rating filter (optional, since backend handles it)
    if (selectedRating === '4.5' && coach.rating < 4.5) {
      return false;
    }
    // Available today filter (optional, since backend handles it)
    // ...
    return true;
  });

  return (
    <AthleteLayout>
      <div className='coaches-container'>
        <h2 className='coaches-heading'>
          <FaSearch /> Find Your Perfect Coach
        </h2>

        <div className='search-container'>
          <FaSearch className='search-icon' />
          <input
            type='text'
            placeholder='Search by sport, name or location...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
          />
        </div>

        <div className='filters-container'>
          {sports.map((sport) => (
            <button
              key={sport}
              className={`filter-btn ${isFilterActive(sport) ? 'active' : ''}`}
              onClick={() => handleFilterClick(sport)}
            >
              {sport}
            </button>
          ))}
        </div>

        {loading ? (
          <div className='loading-container'>
            <div className='loading-spinner'></div>
            <p>Finding the best coaches for you...</p>
          </div>
        ) : (
          <div className='coaches-grid'>
            {filteredCoaches.map((coach) => (
              <div key={coach._id} className='coach-card'>
                <div className='coach-image'>
                  <img src={coach.image} alt={coach.name} />
                  <div className='coach-badge'>
                    <FaMedal />
                  </div>
                </div>
                <div className='coach-info'>
                  <h3 className='coach-name'>{coach.name}</h3>
                  <p className='coach-specialty'>{coach.specialty}</p>
                  <div className='coach-rating'>
                    <div className='stars'>
                      {renderStars(coach.stars, coach.rating)}
                    </div>
                    <span className='rating-text'>
                      {coach.rating} ({coach.reviews || coach.reviewCount || 0}{' '}
                      reviews)
                    </span>
                  </div>
                  <p className='coach-bio'>{coach.bio}</p>
                  <div className='coach-actions'>
                    <button
                      className='btn btn-secondary'
                      onClick={() => handleViewProfile(coach._id)}
                    >
                      <FaUser /> View Profile
                    </button>
                    <button
                      className='btn btn-primary'
                      onClick={() => handleBookSession(coach._id)}
                    >
                      <FaCalendarCheck /> Book Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCoaches.length === 0 && (
          <div className='no-results'>
            <FaRunning className='no-results-icon' />
            <h3>No coaches found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </AthleteLayout>
  );
};

export default FindCoaches;
