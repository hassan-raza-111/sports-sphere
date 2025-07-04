import React from 'react';

const Progress = () => {
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

      <main className="progress-container">
        <h2 className="progress-heading">
          <FontAwesomeIcon icon={faChartLine} /> My Training Progress
        </h2>

        <div className="metrics-grid">
          {[{
            icon: faTachometerAlt,
            label: 'Stamina',
            value: '+10%',
            desc: 'Improvement in endurance over last 4 weeks',
            width: '65%'
          }, {
            icon: faBolt,
            label: 'Speed',
            value: '+8%',
            desc: 'Average sprint time improvement',
            width: '55%'
          }, {
            icon: faDumbbell,
            label: 'Strength',
            value: '+12%',
            desc: 'Increase in max lifting capacity',
            width: '70%'
          }, {
            icon: faBrain,
            label: 'Focus',
            value: '9/10',
            desc: "Coach's latest focus rating",
            width: '90%'
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

          <div className="chart-container">
            <div className="chart-placeholder"></div>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
              <span>Stamina</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#c0392b' }}></div>
              <span>Speed</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#2c3e50' }}></div>
              <span>Strength</span>
            </div>
          </div>
        </section>

        <section className="feedback-section">
          <h3><FontAwesomeIcon icon={faCommentAlt} /> Coach's Feedback</h3>

          {[{
            date: 'June 10, 2025',
            content: `Excellent progress on your endurance training! Your stamina has improved significantly over the past month. Let's focus now on maintaining this while we work on increasing your sprint speed. Your consistency in training is really paying off.`
          }, {
            date: 'May 25, 2025',
            content: `Great work on your strength training - you've hit all your targets this week. I'm particularly impressed with your dedication to proper form, which is showing in your reduced injury risk scores. Keep it up!`
          }].map((feedback, idx) => (
            <div key={idx} className="feedback-card">
              <div className="feedback-meta">
                <span>Coach Williams</span>
                <span>{feedback.date}</span>
              </div>
              <div className="feedback-content">
                <p>{feedback.content}</p>
              </div>
            </div>
          ))}

          <div className="feedback-actions">
            <a href="feeback.html" className="btn">
              <FontAwesomeIcon icon={faEdit} /> Submit Your Feedback
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <FontAwesomeIcon icon={faUser} /> Sport Sphere
          </div>
          <div className="copyright">
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Progress;
