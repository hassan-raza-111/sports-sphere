import React from "react";

const HomePage = () => {
  // Handle button click to store registration type
  const handleRegistrationClick = (type) => {
    localStorage.setItem("registrationType", type);
    // You can navigate or open modal here if needed
  };

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
            <div style={styles.logoText}>Sport Sphere</div>
          </div>
        </a>
        <nav style={styles.nav}>
          <a href="login.html">Login</a>
          <a href="register.html">Sign Up</a>
          <a href="#about">About</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h2 style={styles.heroH2}>Train Smarter. Play Harder.</h2>
        <p style={styles.heroP}>
          Connect with professional coaches, track your progress, and explore
          verified sports gear.
        </p>
        <div style={styles.ctaButtons}>
          <a
            href="register.html?type=athlete"
            className="btn primary"
            onClick={() => handleRegistrationClick("athlete")}
            style={{ ...styles.btn, ...styles.btnPrimary }}
          >
            <i className="fas fa-user" style={styles.icon}></i> Join as Athlete
          </a>
          <a
            href="register.html?type=coach"
            className="btn secondary"
            onClick={() => handleRegistrationClick("coach")}
            style={{ ...styles.btn, ...styles.btnSecondary }}
          >
            <i className="fas fa-chalkboard-teacher" style={styles.icon}></i>{" "}
            Become a Coach
          </a>
          <a
            href="register.html?type=vendor"
            className="btn tertiary"
            onClick={() => handleRegistrationClick("vendor")}
            style={{ ...styles.btn, ...styles.btnTertiary }}
          >
            <i className="fas fa-store" style={styles.icon}></i> Join as Vendor
          </a>
        </div>
      </section>

      {/* About Section */}
      <section style={styles.infoSection} id="about">
        <h3 style={styles.sectionTitle}>Why Choose Sport Sphere?</h3>
        <ul style={styles.ul}>
          {[
            "Personalized coaching sessions with certified professionals",
            "Real-time progress tracking with advanced analytics",
            "Secure payment processing and encrypted messaging",
            "Authentic sports gear marketplace with verified vendors",
            "Comprehensive athlete development programs",
            "Flexible scheduling and session management",
          ].map((item, index) => (
            <li key={index} style={styles.li}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2025 Sport Sphere | All rights reserved</p>
      </footer>

      {/* Scoped Styles */}
      <style jsx>{`
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
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
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 5%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
  logoText: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#2c3e50",
    fontStyle: "italic",
  },
  logoImg: {
    height: "40px",
    width: "auto",
  },
  nav: {
    display: "flex",
    gap: "1.5rem",
  },
  hero: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 5%",
    background:
      'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80") no-repeat center center/cover',
    color: "white",
  },
  heroH2: {
    fontSize: "3rem",
    marginBottom: "1.5rem",
    animation: "fadeIn 1s ease-in-out",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  heroP: {
    fontSize: "1.2rem",
    maxWidth: "700px",
    marginBottom: "2.5rem",
  },
  ctaButtons: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.8rem 1.8rem",
    borderRadius: "30px",
    fontWeight: "bold",
    transition: "all 0.3s",
    textDecoration: "none",
    textAlign: "center",
  },
  icon: {
    marginRight: "8px",
  },
  btnPrimary: {
    backgroundColor: "#e74c3c",
    color: "white",
  },
  btnSecondary: {
    backgroundColor: "#e74c3c",
    color: "white",
  },
  btnTertiary: {
    backgroundColor: "#e74c3c",
    color: "white",
  },
  infoSection: {
    padding: "5rem 5%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "2.2rem",
    color: "#2c3e50",
    marginBottom: "2rem",
    textAlign: "center",
  },
  ul: {
    listStyleType: "none",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  li: {
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s",
    position: "relative",
    paddingLeft: "3rem",
  },
  footer: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#2c3e50",
    color: "white",
  },
};

export default HomePage;
