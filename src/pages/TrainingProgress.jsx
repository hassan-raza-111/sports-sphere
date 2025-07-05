import React from "react";

const trainingStyles = `
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

  /* Header styles - matching previous pages */
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

  /* Progress Dashboard styles */
  .progress-container {
    padding: 140px 5% 60px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .progress-heading {
    font-size: 2.2rem;
    color: white;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 15px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .metric-card {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #e74c3c;
    transition: transform 0.3s;
  }

  .metric-card:hover {
    transform: translateY(-5px);
  }

  .metric-card i {
    font-size: 2rem;
    color: #e74c3c;
    margin-bottom: 1rem;
    background-color: #f9e9e8;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .metric-card:hover i {
    background-color: #e74c3c;
    color: white;
  }

  .metric-card h4 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }

  .metric-card p {
    color: #7f8c8d;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .trend-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    font-size: 0.85rem;
  }

  .trend-up {
    color: #27ae60;
  }

  .trend-down {
    color: #e74c3c;
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
    cursor: pointer;
  }

  .btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }

  /* Chart Section */
  .chart-section {
    margin-top: 2rem;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .chart-title i {
    color: #e74c3c;
  }

  .time-selector {
    display: flex;
    gap: 10px;
  }

  .time-btn {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.85rem;
    background: #f8f9fa;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: all 0.3s;
  }

  .time-btn.active,
  .time-btn:hover {
    background: #e74c3c;
    color: white;
    border-color: #e74c3c;
  }

  .chart-placeholder {
    width: 100%;
    height: 350px;
    background: repeating-linear-gradient(
      45deg,
      rgba(231, 76, 60, 0.1),
      rgba(231, 76, 60, 0.1) 10px,
      rgba(231, 76, 60, 0.2) 10px,
      rgba(231, 76, 60, 0.2) 20px
    );
    border-radius: 5px;
    position: relative;
    overflow: hidden;
  }

  .chart-placeholder::before {
    content: 'Performance Chart';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #7f8c8d;
    font-size: 1.2rem;
  }

  .chart-legend {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-color {
    width: 15px;
    height: 15px;
    border-radius: 3px;
  }

  .legend-color.technique {
    background-color: #e74c3c;
  }

  .legend-color.conditioning {
    background-color: #3498db;
  }

  .legend-color.mindset {
    background-color: #2ecc71;
  }

  /* Feedback Section */
  .feedback-section {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 2rem;
    border-left: 4px solid #e74c3c;
  }

  .feedback-section h3 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .feedback-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    border-left: 3px solid #e74c3c;
  }

  .feedback-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #7f8c8d;
  }

  .feedback-content {
    line-height: 1.6;
    color: #333;
  }

  .feedback-actions {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
  }

  /* Footer styles */
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

  /* Responsive adjustments */
  @media (max-width: 992px) {
    .metrics-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

    .progress-container {
      padding-top: 160px;
    }

    .progress-heading {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 576px) {
    .time-selector {
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .chart-placeholder {
      height: 300px;
    }

    .feedback-actions {
      flex-direction: column;
      gap: 10px;
    }
  }
`;

const TrainingProgress = () => {
  return (
    <div>
      {/* Inject CSS dynamically */}
      <style dangerouslySetInnerHTML={{ __html: trainingStyles }} />

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
            <i className="fas fa-envelope"></i> Messages
            <span className="notification-badge">3</span>
          </a>
          <a href="/coach-dashboard.html" className="profile-btn">
            <i className="fas fa-user-tie"></i>
          </a>
        </nav>
      </header>

      <main className="progress-container">
        <h2 className="progress-heading">
          <i className="fas fa-chart-line"></i> Training Progress Overview
        </h2>

        <div className="metrics-grid">
          <div className="metric-card">
            <i className="fas fa-running"></i>
            <h4>Cardiovascular Fitness</h4>
            <p>
              <strong>Current Level:</strong> Intermediate
            </p>
            <p>
              <strong>Goal:</strong> Advanced
            </p>
            <div className="trend-indicator trend-up">
              <i className="fas fa-arrow-up"></i> 12% improvement this month
            </div>
          </div>

          <div className="metric-card">
            <i className="fas fa-dumbbell"></i>
            <h4>Muscular Strength</h4>
            <p>
              <strong>Current Level:</strong> Beginner
            </p>
            <p>
              <strong>Goal:</strong> Intermediate
            </p>
            <div className="trend-indicator trend-up">
              <i className="fas fa-arrow-up"></i> 18% improvement this month
            </div>
          </div>

          <div className="metric-card">
            <i className="fas fa-bullseye"></i>
            <h4>Technical Accuracy</h4>
            <p>
              <strong>Current Level:</strong> Novice
            </p>
            <p>
              <strong>Goal:</strong> Proficient
            </p>
            <div className="trend-indicator trend-down">
              <i className="fas fa-arrow-down"></i> 5% decline this week
            </div>
          </div>

          <div className="metric-card">
            <i className="fas fa-brain"></i>
            <h4>Mental Focus</h4>
            <p>
              <strong>Current Level:</strong> Developing
            </p>
            <p>
              <strong>Goal:</strong> Mastered
            </p>
            <div className="trend-indicator trend-up">
              <i className="fas fa-arrow-up"></i> 10% improvement this month
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-header">
            <h3 className="chart-title">
              <i className="fas fa-chart-area"></i> Performance Analysis
            </h3>
            <div className="time-selector">
              <button className="time-btn active">1M</button>
              <button className="time-btn">3M</button>
              <button className="time-btn">6M</button>
              <button className="time-btn">1Y</button>
            </div>
          </div>
          <div className="chart-placeholder"></div>

          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color technique"></div> Technique
            </div>
            <div className="legend-item">
              <div className="legend-color conditioning"></div> Conditioning
            </div>
            <div className="legend-item">
              <div className="legend-color mindset"></div> Mindset
            </div>
          </div>
        </div>

        <div className="feedback-section">
          <h3 className="chart-title">
            <i className="fas fa-comments"></i> Recent Feedback
          </h3>

          <div className="feedback-card">
            <div className="feedback-meta">
              <div>
                <strong>Coach Williams</strong> - May 15, 2025
              </div>
              <div>Rating: ⭐⭐⭐⭐⭐</div>
            </div>
            <div className="feedback-content">
              Excellent work on footwork drills. Your consistency has improved
              greatly.
            </div>
          </div>

          <div className="feedback-card">
            <div className="feedback-meta">
              <div>
                <strong>Coach Johnson</strong> - May 12, 2025
              </div>
              <div>Rating: ⭐⭐⭐⭐☆</div>
            </div>
            <div className="feedback-content">
              Good form during strength training, but watch for overextension.
            </div>
          </div>

          <div className="feedback-card">
            <div className="feedback-meta">
              <div>
                <strong>Coach Davis</strong> - May 10, 2025
              </div>
              <div>Rating: ⭐⭐⭐⭐⭐</div>
            </div>
            <div className="feedback-content">
              Impressive recovery time between sets. Keep pushing forward.
            </div>
          </div>

          <div className="feedback-actions">
            <button className="btn">Add New Goal</button>
            <button className="btn">View More</button>
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

export default TrainingProgress;
