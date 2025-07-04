import React from "react";

const findCoachesStyles = `
  /* Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
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

  /* Header Styles */
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
    color: #2c3e50;   
    font-style: italic;
  }

  nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  nav a {
    font-weight: 600;
    color: #2c3e50;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  nav a:hover,
  nav a.active {
    color: #e74c3c;
  }

  .notification-badge {
    background-color: #e74c3c;
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
    background-color: #e74c3c;
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

  /* Find Coaches Page Styles */
  main {
    padding-top: 140px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 140px 5% 60px;
  }

  .coaches-heading {
    font-size: 2.2rem;
    color: white;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 15px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  .coach-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    min-width: 300px;
  }

  .search-input {
    width: 100%;
    padding: 10px 15px 10px 40px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 1rem;
    background-color: #fff;
    outline: none;
    transition: all 0.3s;
  }

  .search-input:focus {
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }

  .search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
    pointer-events: none;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .filter-btn {
    padding: 0.5rem 1.2rem;
    background-color: rgba(255, 255, 255, 0.95);
    border: 2px solid #e1e5eb;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .filter-btn:hover,
  .filter-btn.active {
    background-color: #e74c3c;
    color: white;
    border-color: #e74c3c;
  }

  .coaches-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .coach-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    border-left: 4px solid #e74c3c;
  }

  .coach-card:hover {
    transform: translateY(-5px);
  }

  .coach-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .coach-avatar {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #e74c3c;
  }

  .coach-name {
    font-size: 1.3rem;
    color: #2c3e50;
    font-weight: 600;
  }

  .coach-location {
    font-size: 0.9rem;
    color: #7f8c8d;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 0.5rem;
    color: #f1c40f;
  }

  .stars {
    display: flex;
    gap: 2px;
  }

  .stars i {
    color: #f1c40f;
  }

  .reviews {
    color: #7f8c8d;
    font-size: 0.85rem;
    margin-top: 4px;
  }

  .coach-bio {
    font-size: 0.95rem;
    color: #333;
    margin-top: 1rem;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }

  .coach-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
  }

  .btn {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background-color: #e74c3c;
    color: white;
    border-radius: 30px;
    font-weight: 600;
    transition: background-color 0.3s, transform 0.2s;
    text-decoration: none;
    text-align: center;
  }

  .btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }

  .btn.secondary {
    background-color: transparent;
    border: 2px solid #e74c3c;
    color: #e74c3c;
  }

  .btn.secondary:hover {
    background-color: #e74c3c;
    color: white;
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

  @media (max-width: 768px) {
    header {
      flex-direction: column;
      gap: 1rem;
    }

    nav {
      width: 100%;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    main {
      padding-top: 160px;
    }

    .coaches-heading {
      font-size: 1.8rem;
    }

    .coach-actions {
      flex-direction: column;
      align-items: flex-start;
    }

    .search-wrapper {
      width: 100%;
    }
  }

  @media (max-width: 576px) {
    .coaches-grid {
      grid-template-columns: 1fr;
    }

    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
`;

const FindCoaches = () => {
  return (
    <div>
      {/* Inject CSS dynamically */}
      <style dangerouslySetInnerHTML={{ __html: findCoachesStyles }} />

      <header>
        <a href="/index.html" className="logo">
          <img
            src="/assets/images/Logo.png"
            alt="Sport Sphere Logo"
            className="logo-img"
          />
          <div>
            <div className="logo-text">Sports Sphere</div>
          </div>
        </a>
        <nav>
          <a href="/index.html">
            <i className="fas fa-home"></i> Home
          </a>
          <a href="#" className="active">
            <i className="fas fa-running"></i> Find Coaches
          </a>
          <a href="#">
            <i className="fas fa-trophy"></i> Achievements
          </a>
          <a href="#" className="profile-btn">
            <i className="fas fa-user"></i>
          </a>
        </nav>
      </header>

      <main className="coaches-container">
        <h2 className="coaches-heading">
          <i className="fas fa-users"></i> Find Your Coach
        </h2>

        <div className="coach-actions">
          <div className="search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or sport..."
            />
          </div>

          <div className="filters">
            <button className="filter-btn active">All Sports</button>
            <button className="filter-btn">Tennis</button>
            <button className="filter-btn">Basketball</button>
            <button className="filter-btn">Soccer</button>
            <button className="filter-btn">Swimming</button>
            <button className="filter-btn">Golf</button>
            <button className="filter-btn">Volleyball</button>
            <button className="filter-btn">Cycling</button>
          </div>
        </div>

        <div className="coaches-grid">
          {/* Coach Card 1 */}
          <div className="coach-card">
            <div className="coach-header">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Coach Williams"
                className="coach-avatar"
              />
              <div>
                <div className="coach-name">Coach Williams</div>
                <div className="coach-location">New York, USA</div>
              </div>
            </div>

            <div className="rating">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
              </div>
              <span className="reviews">(4.5)</span>
            </div>

            <div className="coach-bio">
              Specializing in tennis coaching with over 10 years of experience.
            </div>

            <div className="coach-footer">
              <button className="btn secondary">View Profile</button>
              <button className="btn">Book Session</button>
            </div>
          </div>

          {/* Coach Card 2 */}
          <div className="coach-card">
            <div className="coach-header">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Coach Johnson"
                className="coach-avatar"
              />
              <div>
                <div className="coach-name">Coach Johnson</div>
                <div className="coach-location">Los Angeles, USA</div>
              </div>
            </div>

            <div className="rating">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <i className="far fa-star"></i>
              </div>
              <span className="reviews">(4.3)</span>
            </div>

            <div className="coach-bio">
              Certified basketball coach with a focus on youth development.
            </div>

            <div className="coach-footer">
              <button className="btn secondary">View Profile</button>
              <button className="btn">Book Session</button>
            </div>
          </div>

          {/* Coach Card 3 */}
          <div className="coach-card">
            <div className="coach-header">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Coach Davis"
                className="coach-avatar"
              />
              <div>
                <div className="coach-name">Coach Davis</div>
                <div className="coach-location">Chicago, USA</div>
              </div>
            </div>

            <div className="rating">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <span className="reviews">(5.0)</span>
            </div>

            <div className="coach-bio">
              Elite soccer trainer with professional team experience.
            </div>

            <div className="coach-footer">
              <button className="btn secondary">View Profile</button>
              <button className="btn">Book Session</button>
            </div>
          </div>

          {/* Coach Card 4 */}
          <div className="coach-card">
            <div className="coach-header">
              <img
                src="https://randomuser.me/api/portraits/women/63.jpg"
                alt="Coach Lee"
                className="coach-avatar"
              />
              <div>
                <div className="coach-name">Coach Lee</div>
                <div className="coach-location">Houston, USA</div>
              </div>
            </div>

            <div className="rating">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
              </div>
              <span className="reviews">(4.0)</span>
            </div>

            <div className="coach-bio">
              Swimming coach with Olympic-level training programs.
            </div>

            <div className="coach-footer">
              <button className="btn secondary">View Profile</button>
              <button className="btn">Book Session</button>
            </div>
          </div>

          {/* Coach Card 5 */}
          <div className="coach-card">
            <div className="coach-header">
              <img
                src="https://randomuser.me/api/portraits/men/67.jpg"
                alt="Coach Rodriguez"
                className="coach-avatar"
              />
              <div>
                <div className="coach-name">Coach Rodriguez</div>
                <div className="coach-location">Miami, USA</div>
              </div>
            </div>

            <div className="rating">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <span className="reviews">(4.8)</span>
            </div>

            <div className="coach-bio">
              Golf instructor with PGA certification. Personalized lessons
              available.
            </div>

            <div className="coach-footer">
              <button className="btn secondary">View Profile</button>
              <button className="btn">Book Session</button>
            </div>
          </div>

          {/* Coach Card 6 */}
          <div className="coach-card">
            <div className="coach-header">
              <img
                src="https://randomuser.me/api/portraits/women/28.jpg"
                alt="Coach Wilson"
                className="coach-avatar"
              />
              <div>
                <div className="coach-name">Coach Wilson</div>
                <div className="coach-location">Austin, USA</div>
              </div>
            </div>

            <div className="rating">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <span className="reviews">(5.0)</span>
            </div>

            <div className="coach-bio">
              Cycling coach with endurance training expertise.
            </div>

            <div className="coach-footer">
              <button className="btn secondary">View Profile</button>
              <button className="btn">Book Session</button>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-running"></i> Sport Sphere
          </div>
          <div className="copyright">
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FindCoaches;
