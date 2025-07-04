import React from 'react';
import { Link } from 'react-router-dom';


const Progress = () => {
  return (
    <div className="progress-wrapper">
      <style jsx="true">{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          padding: 1rem 5%;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 10;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-img {
          height: 40px;
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }
        nav {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        nav a {
          color: #2c3e50;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.3s;
          text-decoration: none;
        }
        nav a:hover {
          color: #e74c3c;
        }
        .notification-badge {
          background: #e74c3c;
          color: #fff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile-btn {
          background: #e74c3c;
          color: #fff;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        .profile-btn:hover {
          background: #c0392b;
        }
        .progress-container {
          padding: 130px 5% 40px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .progress-heading {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .metric-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .metric-card h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        .metric-value {
          font-size: 1.5rem;
          color: #e74c3c;
          margin-bottom: 0.5rem;
        }
        .metric-description {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-bottom: 0.5rem;
        }
        .progress-bar {
          background: #e1e5eb;
          height: 8px;
          border-radius: 5px;
          overflow: hidden;
        }
        .progress-fill {
          background: #e74c3c;
          height: 100%;
        }
        .charts-section {
          margin-bottom: 3rem;
        }
        .charts-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1rem;
          color: #2c3e50;
        }
        .chart-placeholder {
          height: 200px;
          background: #ecf0f1;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .chart-legend {
          display: flex;
          gap: 1rem;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .legend-color {
          width: 15px;
          height: 15px;
          border-radius: 3px;
        }
        .feedback-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1rem;
          color: #2c3e50;
        }
        .feedback-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
        .feedback-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #7f8c8d;
        }
        .feedback-content {
          color: #2c3e50;
        }
        .feedback-actions {
          margin-top: 1rem;
        }
        .btn {
          background: #e74c3c;
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 5px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: background 0.3s;
        }
        .btn:hover {
          background: #c0392b;
        }
        footer {
          background: rgba(44, 62, 80, 0.9);
          color: white;
          padding: 2rem 5%;
          margin-top: 3rem;
        }
        .footer-content {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>

      <header>
        <Link to="/" className="logo">
          <img src="../../assests/images/Logo.png" alt="Sport Sphere Logo" className="logo-img" />
          <div className="logo-text">Sports Sphere</div>
        </Link>
        <nav>
          <Link to="/"><FontAwesomeIcon icon={faHome} /> Home</Link>
          <Link to="/athlete"><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</Link>
          <Link to="/messages">
            <FontAwesomeIcon icon={faEnvelope} /> Messages
            <span className="notification-badge">3</span>
          </Link>
          <Link to="/profile" className="profile-btn">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </nav>
      </header>

      <main className="progress-container">
        <h2 className="progress-heading">
          <FontAwesomeIcon icon={faChartLine} /> My Training Progress
        </h2>

        <div className="metrics-grid">
          {[{
            icon: faTachometerAlt, label: 'Stamina', value: '+10%', desc: 'Improvement in endurance', width: '65%'
          }, {
            icon: faBolt, label: 'Speed', value: '+8%', desc: 'Sprint time improvement', width: '55%'
          }, {
            icon: faDumbbell, label: 'Strength', value: '+12%', desc: 'Max lifting capacity', width: '70%'
          }, {
            icon: faBrain, label: 'Focus', value: '9/10', desc: "Coach's latest focus rating", width: '90%'
          }].map((metric, idx) => (
            <div key={idx} className="metric-card">
              <h3><FontAwesomeIcon icon={metric.icon} /> {metric.label}</h3>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-description">{metric.desc}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: metric.width }}></div>
              </div>
            </div>
          ))}
        </div>

        <section className="charts-section">
          <h3><FontAwesomeIcon icon={faChartBar} /> Performance Trends</h3>
          <div className="chart-placeholder"></div>
          <div className="chart-legend">
            <div className="legend-item"><div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div> Stamina</div>
            <div className="legend-item"><div className="legend-color" style={{ backgroundColor: '#c0392b' }}></div> Speed</div>
            <div className="legend-item"><div className="legend-color" style={{ backgroundColor: '#2c3e50' }}></div> Strength</div>
          </div>
        </section>

        <section className="feedback-section">
          <h3><FontAwesomeIcon icon={faCommentAlt} /> Coach's Feedback</h3>
          {[{
            date: 'June 10, 2025',
            content: 'Excellent progress on endurance training! Keep focusing on sprint speed next.'
          }, {
            date: 'May 25, 2025',
            content: 'Great work on strength targets! Your form and consistency have improved.'
          }].map((fb, idx) => (
            <div key={idx} className="feedback-card">
              <div className="feedback-meta">
                <span>Coach Williams</span>
                <span>{fb.date}</span>
              </div>
              <div className="feedback-content">
                <p>{fb.content}</p>
              </div>
            </div>
          ))}
          <div className="feedback-actions">
            <Link to="/feedback" className="btn">
              <FontAwesomeIcon icon={faEdit} /> Submit Your Feedback
            </Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <FontAwesomeIcon icon={faUser} /> Sport Sphere
          </div>
          <div>© 2025 Sport Sphere. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Progress;
