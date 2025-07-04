import React from 'react';
import logo from '../../assets/images/Logo.png';


const Profile = () => {
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
        <a href="../index.html" className="logo">
          <img src={logo} alt="Sport Sphere Logo" className="logo-img" />
          <div className="logo-text">Sports Sphere</div>
        </a>
        <nav>
          <a href="athlete.html"><i className="fas fa-tachometer-alt"></i> Dashboard</a>
          <a href="find-coaches.html"><i className="fas fa-search"></i> Find Coaches</a>
          <a href="message.html" className="active">
            <i className="fas fa-envelope"></i> Messages <span className="notification-badge">3</span>
          </a>
          <a href="progress.html"><i className="fas fa-chart-line"></i> Progress</a>
          <a href="athelte-profile.html" className="profile-btn"><i className="fas fa-user-tie"></i></a>
        </nav>
      </header>

      <main className="profile-container">
        <div className="profile-header">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Profile" className="profile-image" />
          <div className="profile-info">
            <h2>Alex Morgan</h2>
            <p><i className="fas fa-user"></i> Professional Athlete | Football</p>
            <p><i className="fas fa-map-marker-alt"></i> Los Angeles, CA</p>
            <p><i className="fas fa-envelope"></i> alex.morgan@sportsphere.com</p>
            <p><i className="fas fa-phone"></i> (555) 123-4567</p>
            <div className="profile-buttons">
              <a href="booking.html" className="btn secondary"><i className="fas fa-calendar"></i> Book Session</a>
              <a href="#" className="btn secondary"><i className="fas fa-share-alt"></i> Share Profile</a>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3><i className="fas fa-info-circle"></i> About Me</h3>
          <p>Professional football athlete with 8 years of competitive experience...</p>
          <p>My training philosophy focuses on consistent improvement...</p>
          <div className="stat-grid">
            <div className="stat-box"><h4>22</h4><p>Sessions Completed</p></div>
            <div className="stat-box"><h4>4.8</h4><p>Avg Coach Rating</p></div>
            <div className="stat-box"><h4>90%</h4><p>Goal Progress</p></div>
            <div className="stat-box"><h4>3</h4><p>Current Bookings</p></div>
          </div>
        </div>

        <div className="profile-section">
          <h3><i className="fas fa-trophy"></i> Achievements</h3>
          <p><strong>2024 National Championships</strong> - 1st Place Offensive Player</p>
          <p><strong>2023 Regional Tournament</strong> - MVP Award</p>
        </div>

        <div className="profile-section">
          <h3><i className="fas fa-bullseye"></i> Current Goals</h3>
          <p><i className="fas fa-circle" style={{ color: "#e74c3c" }}></i> Improve 40-yard dash time by 0.3 seconds</p>
          <p><i className="fas fa-circle" style={{ color: "#e74c3c" }}></i> Master 3 new offensive plays</p>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo"><i className="fas fa-running"></i> Sport Sphere</div>
          <div className="copyright">&copy; 2025 Sport Sphere. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
};

export default Profile;
