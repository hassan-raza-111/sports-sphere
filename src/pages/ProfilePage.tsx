import React from "react";

const ProfilePage = () => {
  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={styles.header}>
        <a href="index.html" className="logo" style={styles.logo}>
          <img
            src="assets/images/Logo.png"
            alt="Sport Sphere Logo"
            style={styles.logoImg}
          />
          <div>
            <div style={styles.logoText}>Sports Sphere</div>
          </div>
        </a>
        <nav style={styles.nav}>
          <a href="athlete_dashboard.html" style={styles.navLink}>
            <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span>
          </a>
          <a href="find_coaches.html" style={styles.navLink}>
            <i className="fas fa-search"></i> <span>Find Coaches</span>
          </a>
          <a
            href="message.html"
            style={{ ...styles.navLink, ...styles.active }}
          >
            <i className="fas fa-envelope"></i> <span>Messages</span>
            <span style={styles.notificationBadge}>3</span>
          </a>
          <a href="progress.html" style={styles.navLink}>
            <i className="fas fa-chart-line"></i> <span>Progress</span>
          </a>
          <a href="profile.html" style={styles.profileBtn}>
            <i className="fas fa-user-tie"></i>
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main style={styles.profileContainer}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Profile"
            style={styles.profileImage}
          />
          <div style={styles.profileInfo}>
            <h2>Alex Morgan</h2>
            <p style={styles.infoItem}>
              <i className="fas fa-user"></i> Professional Athlete | Football
            </p>
            <p style={styles.infoItem}>
              <i className="fas fa-map-marker-alt"></i> Los Angeles, CA
            </p>
            <p style={styles.infoItem}>
              <i className="fas fa-envelope"></i> alex.morgan@sportsphere.com
            </p>
            <p style={styles.infoItem}>
              <i className="fas fa-phone"></i> (555) 123-4567
            </p>
            <div style={styles.profileButtons}>
              <a
                href="booking.html"
                style={{ ...styles.btn, ...styles.secondaryBtn }}
              >
                <i className="fas fa-calendar"></i> Book Session
              </a>
              <a href="#" style={{ ...styles.btn, ...styles.secondaryBtn }}>
                <i className="fas fa-share-alt"></i> Share Profile
              </a>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div style={styles.profileSection}>
          <h3 style={styles.sectionTitle}>
            <i className="fas fa-info-circle"></i> About Me
          </h3>
          <p style={styles.sectionText}>
            Professional football athlete with 8 years of competitive
            experience. Specializing in offensive strategies and endurance
            training. Currently training for national championships with a focus
            on speed and agility improvement. Former team captain with
            demonstrated leadership skills and a passion for mentoring younger
            athletes.
          </p>
          <p style={styles.sectionText}>
            My training philosophy focuses on consistent improvement through
            measurable goals, data-driven performance analysis, and
            collaborative coaching relationships. I believe in balancing intense
            physical training with mental preparation and recovery.
          </p>

          {/* Stats Grid */}
          <div style={styles.statGrid}>
            <div style={styles.statBox}>
              <h4 style={styles.statValue}>22</h4>
              <p style={styles.statLabel}>Sessions Completed</p>
            </div>
            <div style={styles.statBox}>
              <h4 style={styles.statValue}>4.8</h4>
              <p style={styles.statLabel}>Avg Coach Rating</p>
            </div>
            <div style={styles.statBox}>
              <h4 style={styles.statValue}>90%</h4>
              <p style={styles.statLabel}>Goal Progress</p>
            </div>
            <div style={styles.statBox}>
              <h4 style={styles.statValue}>3</h4>
              <p style={styles.statLabel}>Current Bookings</p>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div style={styles.profileSection}>
          <h3 style={styles.sectionTitle}>
            <i className="fas fa-trophy"></i> Achievements
          </h3>
          <p style={styles.sectionText}>
            <strong>2024 National Championships</strong> - 1st Place Offensive
            Player
            <br />
            <strong>2023 Regional Tournament</strong> - MVP Award
            <br />
            <strong>2022 Collegiate League</strong> - All-Star Team Selection
            <br />
            <strong>2021 State Championships</strong> - Top Scorer Award
          </p>
        </div>

        {/* Goals Section */}
        <div style={styles.profileSection}>
          <h3 style={styles.sectionTitle}>
            <i className="fas fa-bullseye"></i> Current Goals
          </h3>
          <p style={styles.sectionText}>
            <i
              className="fas fa-circle"
              style={{ color: "#e74c3c", marginRight: "8px" }}
            ></i>
            Improve 40-yard dash time by 0.3 seconds (in progress)
            <br />
            <i
              className="fas fa-circle"
              style={{ color: "#e74c3c", marginRight: "8px" }}
            ></i>
            Increase vertical jump by 4 inches (in progress)
            <br />
            <i
              className="fas fa-circle"
              style={{ color: "#e74c3c", marginRight: "8px" }}
            ></i>
            Reduce recovery time between sprints by 15%
            <br />
            <i
              className="fas fa-circle"
              style={{ color: "#e74c3c", marginRight: "8px" }}
            ></i>
            Master 3 new offensive plays
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <i className="fas fa-running"></i> Sport Sphere
          </div>
          <div style={styles.copyright}>
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Inline Styles Object
const styles = {
  body: {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
    lineHeight: 1.6,
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 5%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoImg: {
    height: "40px",
    width: "auto",
  },
  logoText: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#2c3e50",
    fontStyle: "italic",
  },
  nav: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  navLink: {
    fontWeight: 600,
    color: "#2c3e50",
    transition: "color 0.3s",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  active: {
    color: "#e74c3c",
  },
  notificationBadge: {
    backgroundColor: "#e74c3c",
    color: "white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "0.7rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "5px",
  },
  profileBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s",
  },
  profileContainer: {
    maxWidth: "1000px",
    margin: "140px auto 60px",
    padding: "0 5%",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    flexWrap: "wrap",
    marginBottom: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "5px solid #e74c3c",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  profileInfo: {
    flex: 1,
  },
  infoItem: {
    color: "#7f8c8d",
    fontSize: "1rem",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  profileButtons: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    borderRadius: "5px",
    fontSize: "0.95rem",
    fontWeight: "600",
    textDecoration: "none",
    color: "white",
    backgroundColor: "#e74c3c",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    border: "2px solid #e74c3c",
    color: "#e74c3c",
  },
  btnHover: {
    backgroundColor: "#c0392b",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  },
  profileSection: {
    marginTop: "30px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: "#2c3e50",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  sectionText: {
    color: "#7f8c8d",
    fontSize: "1rem",
    lineHeight: 1.7,
    marginBottom: "20px",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  statBox: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s",
    borderLeft: "4px solid #e74c3c",
  },
  statValue: {
    fontSize: "2rem",
    color: "#e74c3c",
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#7f8c8d",
  },
  footer: {
    backgroundColor: "rgba(44, 62, 80, 0.9)",
    color: "white",
    padding: "2rem 5%",
    marginTop: "3rem",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLogo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  copyright: {
    fontSize: "0.9rem",
  },
};

export default ProfilePage;
