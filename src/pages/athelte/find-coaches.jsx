import React from 'react';

const FindCoaches = () => {
  return (
    <>
      <header>
        <a href="../index.html" className="logo">
          <img src="../../assests/images/Logo.png" alt="Sport Sphere Logo" className="logo-img" />
          <div>
            <div className="logo-text">Sports Sphere</div>
          </div>
        </a>
        <nav>
          <a href="../index.html"><FontAwesomeIcon icon={faHome} /> <span>Home</span></a>
          <a href="athlete.html"><FontAwesomeIcon icon={faTachometerAlt} /> <span>Dashboard</span></a>
          <a href="message.html">
            <FontAwesomeIcon icon={faEnvelope} /> <span>Messages</span>
            <span className="notification-badge">3</span>
          </a>
          <a href="athelte-profile.html" className="profile-btn">
            <FontAwesomeIcon icon={faUser} />
          </a>
        </nav>
      </header>

      <main className="coaches-container">
        <h2 className="coaches-heading">
          <FontAwesomeIcon icon={faSearch} /> Find Your Perfect Coach
        </h2>

        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input type="text" placeholder="Search by sport, name or location..." className="search-input" />
        </div>

        <div className="filters">
          {['All Sports', 'Tennis', 'Football', 'Basketball', 'Swimming', '4.5+ Rating', 'Available Today'].map((label, index) => (
            <div key={index} className={`filter-btn ${index === 0 ? 'active' : ''}`}>{label}</div>
          ))}
        </div>

        <div className="coaches-grid">
          {[
            {
              name: 'Coach Sarah Williams',
              specialty: 'Professional Tennis Coach',
              rating: 4.8,
              reviews: 128,
              stars: [1, 1, 1, 1, 0.5],
              bio: 'Former professional tennis player with 5+ years coaching experience. Specializes in technique refinement and competitive strategy.',
              image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
            },
            {
              name: 'Coach David Chen',
              specialty: 'Elite Football Coach',
              rating: 5.0,
              reviews: 94,
              stars: [1, 1, 1, 1, 1],
              bio: 'NFL certified coach with 7 years experience developing athletes at all levels. Focuses on speed, agility, and game intelligence.',
              image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
            },
            {
              name: 'Coach Jessica Lee',
              specialty: 'Olympic Swimming Coach',
              rating: 4.2,
              reviews: 76,
              stars: [1, 1, 1, 1, 0],
              bio: 'Former Olympic swimmer with 10+ years coaching experience. Specializes in stroke technique and endurance training.',
              image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'
            }
          ].map((coach, idx) => (
            <div className="coach-card" key={idx}>
              <div className="coach-image" style={{ backgroundImage: `url(${coach.image})` }}></div>
              <div className="coach-info">
                <h3>{coach.name}</h3>
                <div className="coach-specialty">
                  <FontAwesomeIcon icon={faMedal} />
                  <span>{coach.specialty}</span>
                </div>
                <div className="coach-rating">
                  <div className="stars">
                    {coach.stars.map((val, i) =>
                      val === 1 ? <FontAwesomeIcon key={i} icon={faStar} /> :
                      val === 0.5 ? <FontAwesomeIcon key={i} icon={faStarHalfAlt} /> :
                      <FontAwesomeIcon key={i} icon={["far", "star"]} />
                    )}
                  </div>
                  <span className="review-count">{coach.rating} ({coach.reviews} reviews)</span>
                </div>
                <p className="coach-bio">{coach.bio}</p>
                <div className="coach-actions">
                  <a href="athelte-profile.html" className="btn"><FontAwesomeIcon icon={faUser} /> View Profile</a>
                  <a href="booking.html" className="btn secondary"><FontAwesomeIcon icon={faCalendarCheck} /> Book Session</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <FontAwesomeIcon icon={faRunning} /> Sport Sphere
          </div>
          <div className="copyright">
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default FindCoaches;
