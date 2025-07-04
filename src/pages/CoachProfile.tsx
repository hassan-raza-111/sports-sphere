import React from "react";

const coachStyles = `
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

  /* Coach Profile Page Styles */
  main {
    padding-top: 140px;
    max-width: 900px;
    margin: 0 auto;
    padding: 140px 5% 60px;
  }

  .profile-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .profile-header img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #e74c3c;
    margin-bottom: 15px;
  }

  .profile-header h2 {
    font-size: 2rem;
    color: white;
    margin-bottom: 5px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  .profile-header p {
    color: #f8f9fa;
    font-size: 1.1rem;
    font-style: italic;
  }

  .profile-section {
    background: rgba(255, 255, 255, 0.95);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
    border-left: 4px solid #e74c3c;
  }

  .profile-section h3 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    color: #333;
  }

  .info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }

  .info-item {
    flex: 1;
    min-width: 250px;
  }

  .info-label {
    font-weight: 600;
    color: #7f8c8d;
    margin-bottom: 5px;
    font-size: 0.9rem;
  }

  .info-value {
    font-size: 1rem;
    color: #333;
    background: #f8f9fa;
    padding: 10px 15px;
    border-radius: 5px;
    border-left: 3px solid #e74c3c;
  }

  .bio {
    font-size: 1rem;
    line-height: 1.8;
    color: #333;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    border-left: 3px solid #e74c3c;
  }

  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 30px;
  }

  .stat-box {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    text-align: center;
    transition: transform 0.3s;
    border-left: 4px solid #e74c3c;
  }

  .stat-box:hover {
    transform: translateY(-5px);
  }

  .stat-box h4 {
    font-size: 2rem;
    color: #e74c3c;
    margin-bottom: 5px;
  }

  .stat-box p {
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-bottom: 0;
  }

  .feedback-section {
    margin-top: 30px;
  }

  .testimonial {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 0.95rem;
    line-height: 1.6;
    border-left: 3px solid #e74c3c;
    position: relative;
  }

  .testimonial::before {
    content: "“";
    font-family: serif;
    font-size: 4rem;
    color: rgba(231, 76, 60, 0.1);
    position: absolute;
    top: 5px;
    left: 10px;
  }

  .btn {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background-color: #e74c3c;
    color: white;
    border-radius: 5px;
    font-weight: 600;
    transition: background-color 0.3s, transform 0.2s;
    text-decoration: none;
    text-align: center;
    margin: 1rem auto 0;
    display: block;
    width: fit-content;
  }

  .btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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

    .profile-header h2 {
      font-size: 1.8rem;
    }

    .stats-overview {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  @media (max-width: 576px) {
    .info-row {
      flex-direction: column;
    }

    .info-item {
      min-width: 100%;
    }

    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
`;

const CoachProfile = () => {
  return (
    <div>
      {/* Inject CSS dynamically */}
      <style dangerouslySetInnerHTML={{ __html: coachStyles }} />

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
          <a href="/coach-dashboard.html" className="active">
            <i className="fas fa-user-shield"></i> Dashboard
          </a>
          <a href="/messages.html">
            <i className="fas fa-envelope"></i> Messages{" "}
            <span className="notification-badge">3</span>
          </a>
          <a href="/coach-profile.html" className="profile-btn">
            <i className="fas fa-user-tie"></i>
          </a>
        </nav>
      </header>

      <main>
        <div className="profile-header">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Coach Profile"
          />
          <h2>Alex Morgan</h2>
          <p>
            <i className="fas fa-running"></i> Tennis Coach | 10 Years
            Experience
          </p>
        </div>

        <div className="profile-section">
          <h3>
            <i className="fas fa-info-circle"></i> Personal Information
          </h3>
          <div className="section-content">
            <div className="info-row">
              <div className="info-item">
                <div className="info-label">Email</div>
                <div className="info-value">
                  alex.morgan@coach.sportsphere.com
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Phone</div>
                <div className="info-value">+1 555-123-4567</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-item">
                <div className="info-label">Location</div>
                <div className="info-value">New York, USA</div>
              </div>
              <div className="info-item">
                <div className="info-label">Certifications</div>
                <div className="info-value">USPTA, ITF Level 2</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-item">
                <div className="info-label">Specialization</div>
                <div className="info-value">Tennis, Youth Development</div>
              </div>
              <div className="info-item">
                <div className="info-label">Years of Experience</div>
                <div className="info-value">10+</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-item">
                <div className="info-label">About Me</div>
                <div className="info-value bio">
                  I'm passionate about developing athletes at every level. My
                  approach focuses on technique, mindset, and long-term growth.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-box">
            <h4>12</h4>
            <p>Active Athletes</p>
          </div>
          <div className="stat-box">
            <h4>187</h4>
            <p>Total Sessions</p>
          </div>
          <div className="stat-box">
            <h4>4.8</h4>
            <p>Average Rating</p>
          </div>
        </div>

        <div className="profile-section feedback-section">
          <h3>
            <i className="fas fa-comments"></i> Recent Feedback
          </h3>
          <div className="section-content">
            <div className="testimonial">
              “Alex has helped me improve my serve by 20 mph through consistent
              drills and personalized guidance.”
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                — Sarah Johnson, Tennis Athlete
              </div>
            </div>

            <div className="testimonial">
              “Coach Morgan’s training programs are well structured and easy to
              follow. Highly recommended for beginners!”
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                — Jamie Lee, Junior Player
              </div>
            </div>

            <div className="testimonial">
              “Great communication and real-time feedback during sessions. Made
              a huge difference in my game.”
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                — Taylor Smith, College Player
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="btn secondary">View All Feedback</button>
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

export default CoachProfile;
