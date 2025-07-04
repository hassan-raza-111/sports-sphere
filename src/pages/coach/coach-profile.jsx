import React from 'react';
import logoImg from '../../assets/images/Logo.png';

const CoachProfile = () => (
  <>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Coach Profile | Sport Sphere</title>
      {/* Font Awesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style>
        {`
        /* Global Styles */
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
          --white: #ffffff;
        }
        body {
          color: #333;
          line-height: 1.6;
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
          min-height: 100vh;
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
        nav a:hover,
        nav a.active {
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
        /* Main Content Styles */
        .profile-container {
          max-width: 1000px;
          margin: 140px auto 60px;
          padding: 0 5%;
        }
        /* Profile Header */
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
          border-left: 5px solid var(--primary-red);
        }
        .profile-image {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid var(--primary-red);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .profile-info h2 {
          font-size: 2.2rem;
          margin-bottom: 10px;
          color: var(--dark-blue);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .profile-info p {
          color: var(--light-gray);
          font-size: 1rem;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .certification-badge {
          background-color: var(--primary-red);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
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
        /* Profile Sections */
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
          border-bottom: 2px solid var(--off-white);
          padding-bottom: 10px;
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
        /* Stats Grid */
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
          margin-bottom: 0;
        }
        /* Feedback Section */
        .feedback-section {
          margin-top: 30px;
        }
        .testimonial {
          background: var(--off-white);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 0.95rem;
          line-height: 1.6;
          position: relative;
          border-left: 3px solid var(--primary-red);
        }
        .testimonial::before {
          content: "";
          font-family: serif;
          font-size: 4rem;
          color: rgba(231, 76, 60, 0.1);
          position: absolute;
          top: 10px;
          left: 10px;
        }
        .testimonial strong {
          color: var(--dark-blue);
          display: block;
          margin-bottom: 5px;
          font-size: 1.05rem;
        }
        .testimonial .rating {
          color: #f1c40f;
          margin-top: 5px;
        }
        /* Footer */
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
        /* Responsive */
        @media(max-width:768px){
          .profile-header {
            flex-direction: column;
            text-align: center;
            padding:25px;
          }
          .profile-info p {
            justify-content: center;
          }
          .profile-buttons {
            justify-content: center;
          }
          .stat-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media(max-width:480px){
          .profile-container {
            margin-top: 120px;
          }
          .profile-image {
            width: 120px;
            height: 120px;
          }
          .stat-grid {
            grid-template-columns: 1fr;
          }
          .profile-buttons {
            flex-direction: column;
            gap:10px;
          }
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
        `}
      </style>
    </head>
    <body>
      {/* Header */}
      <header>
        <a href="../index.html" className="logo">
          <img src={logoImg} alt="Sport Sphere Logo" className="logo-img" />
          <div>
            <div className="logo-text">Sports Sphere</div>
          </div>
        </a>
        <nav>
          <a href="../index.html"><i className="fas fa-home"></i> Home</a>
          <a href="coach.html" className="active"><i className="fas fa-chalkboard-teacher"></i> Dashboard</a>
          <a href="message.html">
            <i className="fas fa-envelope"></i> Messages <span className="notification-badge">3</span>
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="profile-container">
        {/* Coach Info */}
        <div className="profile-header">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Coach Profile"
            className="profile-image"
          />
          <div className="profile-info">
            <h2>
              Coach Sarah Williams{" "}
              <span className="certification-badge">
                <i className="fas fa-certificate"></i> Certified
              </span>
            </h2>
            <p>
              <i className="fas fa-user-tie"></i> Professional Tennis Coach
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i> Miami, Florida
            </p>
            <p>
              <i className="fas fa-envelope"></i> sarah.williams@sportsphere.com
            </p>
            <p>
              <i className="fas fa-phone"></i> (305) 555-7890
            </p>
            <div className="profile-buttons">
              <a href="coach-profile.html" className="btn">
                <i className="fas fa-user-edit"></i> Edit Profile
              </a>
              <a href="progress.html" className="btn secondary">
                <i className="fas fa-chart-line"></i> View Analytics
              </a>
              <a href="booking.html" className="btn secondary">
                <i className="fas fa-calendar-plus"></i> Add Availability
              </a>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="profile-section">
          <h3>
            <i className="fas fa-info-circle"></i> Coaching Philosophy
          </h3>
          <p>
            With over 8 years of professional coaching experience and a background in
            competitive tennis, I specialize in developing athletes who excel in both
            technical skills and mental toughness. My coaching methodology combines
            modern biomechanics with proven psychological techniques to create
            well-rounded players.
          </p>
          <p>
            I hold certifications from the USPTA and PTR, with additional
            specialization in junior development and high-performance training. My
            athletes have gone on to compete at collegiate and professional levels,
            with several achieving national rankings.
          </p>

          {/* Stats Grid */}
          <div className="stat-grid">
            <div className="stat-box">
              <h4>127</h4>
              <p>Athletes Trained</p>
            </div>
            <div className="stat-box">
              <h4>4.9</h4>
              <p>Avg. Rating</p>
            </div>
            <div className="stat-box">
              <h4>94%</h4>
              <p>Retention Rate</p>
            </div>
            <div className="stat-box">
              <h4>42</h4>
              <p>Sessions This Month</p>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="profile-section">
          <h3>
            <i className="fas fa-star"></i> Specialties
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
            <span style={{ background: 'var(--primary-red)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>Serve Technique</span>
            <span style={{ background: 'var(--primary-red)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>Footwork Drills</span>
            <span style={{ background: 'var(--primary-red)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>Mental Toughness</span>
            <span style={{ background: 'var(--primary-red)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>Match Strategy</span>
            <span style={{ background: 'var(--primary-red)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>Junior Development</span>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="profile-section feedback-section">
          <h3>
            <i className="fas fa-comments"></i> Athlete Testimonials
          </h3>
          {/* Testimonials */}
          <div className="testimonial">
            <strong>Alex Morgan</strong>
            <div className="rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            "Coach Sarah transformed my game in just three months. Her attention to detail on my serve technique added 15mph to my first serve. The mental strategies she taught me have been game-changers in tournament play."
          </div>
          <div className="testimonial">
            <strong>Taylor Smith</strong>
            <div className="rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            "As a junior player, Coach Sarah's developmental program helped me move from state-level to national competitions. Her energy and positivity make every session productive while still being fun. I've never improved so quickly!"
          </div>
          <div className="testimonial">
            <strong>Jamie Johnson</strong>
            <div className="rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-half-alt"></i>
            </div>
            "After college tennis, I thought I'd plateaued. Coach Sarah's advanced footwork drills and match analysis took my game to the next level. I'm now competing in regional opens thanks to her coaching."
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-running"></i> Sport Sphere
          </div>
          <div className="copyright">
            © 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </body>
  </>
);

export default CoachProfile;