import React, { useState } from "react";

const CoachDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="body">
      <header>
        <a href="index.html" className="logo">
          <img
            src="assets/images/Logo.png"
            alt="Sport Sphere Logo"
            className="logo-img"
          />
          <div>
            <div className="logo-text">Sports Sphere</div>
          </div>
        </a>
        <nav>
          <a href="coach_dashboard.html" className="active">
            <i className="fas fa-home"></i> <span>Home</span>
          </a>
          <a href="marketplace.html">
            <i className="fas fa-store"></i> <span>Marketplace</span>
          </a>
          <a href="message.html">
            <i className="fas fa-envelope"></i> <span>Messages</span>
            <span className="notification-badge">3</span>
          </a>
          <a href="athelete_progress.html">
            <i className="fas fa-chart-line"></i> <span>Athlete Progress</span>
          </a>
          <a href="profile-coach.html" className="profile-btn">
            <i className="fas fa-user-tie"></i>
          </a>
        </nav>
      </header>

      <main className="dashboard">
        <h2>
          <i className="fas fa-chalkboard-teacher"></i> Welcome, Coach Williams!
        </h2>

        <section className="feature-section card-box">
          <div className="card">
            <h3>
              <i className="fas fa-chart-bar"></i> Progress Reports
            </h3>
            <p>
              Monitor athlete performance with detailed analytics and easily
              track their training journey.
            </p>
            <a href="athelete_progress.html" className="btn secondary">
              <i className="fas fa-file-alt"></i> View Progress
            </a>
          </div>
          <div className="card">
            <h3>
              <i className="fas fa-comments"></i> Athlete Communication
            </h3>
            <p>
              Stay connected through instant messaging, share training plans,
              and provide session feedback in real time.
            </p>
            <a href="message.html" className="btn primary">
              <i className="fas fa-inbox"></i> Go to Messages
            </a>
          </div>
        </section>

        <section className="sessions-section">
          <h3>
            <i className="fas fa-clock"></i> Upcoming Sessions (Next 7 Days)
          </h3>
          <div className="sessions-list">
            <div className="session-item">
              <div className="date">Mon, Jun 5</div>
              <div className="athlete">
                <i className="fas fa-user"></i> Alex Morgan
              </div>
              <div className="time">3:00 PM - 4:30 PM</div>
              <div className="action-btn">
                <a href="#" className="btn small-btn">
                  Details
                </a>
              </div>
            </div>
            <div className="session-item">
              <div className="date">Tue, Jun 6</div>
              <div className="athlete">
                <i className="fas fa-user"></i> Jamie Johnson
              </div>
              <div className="time">10:00 AM - 11:30 AM</div>
              <div className="action-btn">
                <a href="#" className="btn small-btn">
                  Details
                </a>
              </div>
            </div>
            <div className="session-item">
              <div className="date">Wed, Jun 7</div>
              <div className="athlete">
                <i className="fas fa-user"></i> Taylor Smith
              </div>
              <div className="time">5:00 PM - 6:30 PM</div>
              <div className="action-btn">
                <a href="#" className="btn small-btn">
                  Details
                </a>
              </div>
            </div>
            <div className="session-item">
              <div className="date">Fri, Jun 9</div>
              <div className="athlete">
                <i className="fas fa-user"></i> Jordan Lee
              </div>
              <div className="time">4:00 PM - 5:30 PM</div>
              <div className="action-btn">
                <a href="#" className="btn small-btn">
                  Details
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="value">12</div>
            <div className="label">Upcoming Sessions</div>
          </div>
          <div className="stat-card">
            <div className="value">4.9</div>
            <div className="label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="value">87%</div>
            <div className="label">Athlete Retention</div>
          </div>
          <div className="stat-card">
            <div className="value">5</div>
            <div className="label">New Athletes</div>
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

      <style jsx>{`
        /* Reset and base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Arial", sans-serif;
        }
        body {
          color: #333;
          line-height: 1.6;
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            url("https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")
              no-repeat center center/cover;
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
          transition: color 0.3s;
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

        .dashboard {
          padding: 140px 5% 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard h2 {
          font-size: 2.2rem;
          color: white;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 15px;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }

        .card-box {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .card {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          border-left: 4px solid #e74c3c;
        }

        .card:hover {
          transform: translateY(-5px);
        }

        .card h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card h3 i {
          color: #e74c3c;
        }

        .card p {
          color: #7f8c8d;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .btn {
          display: inline-block;
          padding: 0.6rem 1.5rem;
          background-color: #e74c3c;
          color: white;
          border-radius: 5px;
          font-weight: 600;
          transition: background-color 0.3s, transform 0.2s;
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

        .small-btn {
          padding: 0.4rem 1rem;
          font-size: 0.9rem;
        }

        .sessions-section {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          padding: 1.5rem;
          margin-top: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .sessions-section h3 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sessions-list {
          display: grid;
          gap: 1rem;
        }

        .session-item {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr;
          align-items: center;
          transition: all 0.3s;
        }

        .session-item:hover {
          background-color: #e9ecef;
          transform: translateX(5px);
        }

        .session-item .athlete {
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .session-item .time {
          font-weight: 500;
          color: #e74c3c;
        }

        .session-item .action-btn {
          justify-self: end;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .stat-card {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stat-card .value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #e74c3c;
          margin-bottom: 0.5rem;
        }

        .stat-card .label {
          color: #7f8c8d;
          font-size: 0.9rem;
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

        @media (max-width: 992px) {
          .session-item {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .session-item .action-btn {
            grid-column: span 2;
            justify-self: start;
          }
        }

        @media (max-width: 768px) {
          header {
            padding: 1rem 5%;
            flex-direction: column;
            gap: 1rem;
          }
          nav {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          .dashboard {
            padding-top: 160px;
          }
          .dashboard h2 {
            font-size: 1.8rem;
          }
          .card-box {
            grid-template-columns: 1fr;
          }
          .sessions-section h3 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .session-item {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .session-item .action-btn {
            grid-column: auto;
            justify-self: start;
            margin-top: 0.5rem;
          }
          .stats-overview {
            grid-template-columns: 1fr 1fr;
          }
          .footer-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CoachDashboard;
