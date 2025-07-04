import React, { useState } from "react";

export default function BookSessionPage() {
  const [coachDescription, setCoachDescription] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");

  const coachInfo = {
    sarah:
      "Coach Sarah Williams is a Tennis Specialist with over 10 years of experience coaching junior and professional players.",
    mike: "Coach Michael Johnson is a Football Strategist known for developing youth talent and tactical training.",
    jessica:
      "Coach Jessica Lee is a Swimming Expert focusing on stroke correction and endurance training.",
    david:
      "Coach David Chen is a Basketball Tactician who emphasizes team coordination and shooting skills.",
    rachel:
      "Coach Rachel Kim is a Yoga & Wellness coach who specializes in flexibility, mindfulness, and recovery.",
    tony: "Coach Tony Edwards is a Boxing & Strength coach with a strong focus on conditioning and technique.",
  };

  const handleCoachChange = (e) => {
    const value = e.target.value;
    setSelectedCoach(value);
    setCoachDescription(coachInfo[value] || "");
  };

  return (
    <div className="body">
      {/* Header */}
      <header>
        <a href="index.html" className="logo">
          <img
            src="assets/images/Logo.png"
            alt="Sport Sphere Logo"
            className="logo-img"
          />
          <div className="logo-text">Sports Sphere</div>
        </a>
        <nav>
          <a href="athlete_dashboard.html">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </a>
          <a href="index.html">
            <i className="fas fa-home"></i> Home
          </a>
          <a href="message.html">
            <i className="fas fa-envelope"></i> Messages{" "}
            <span className="notification-badge">3</span>
          </a>
          <a href="profile.html" className="profile-btn">
            <i className="fas fa-user"></i>
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="booking-container">
        <h2 className="booking-heading">
          <i className="fas fa-calendar-check"></i> Book a Session
        </h2>

        <div className="booking-form">
          <form>
            <div className="form-group">
              <label htmlFor="coach">Select Coach</label>
              <select
                id="coach"
                value={selectedCoach}
                onChange={handleCoachChange}
              >
                <option value="" disabled>
                  Choose a coach
                </option>
                <option value="sarah">
                  Coach Sarah Williams – Tennis Specialist – PKR 2700/hr
                </option>
                <option value="mike">
                  Coach Michael Johnson – Football Strategist – PKR 1300/hr
                </option>
                <option value="jessica">
                  Coach Jessica Lee – Swimming Expert – PKR 1000/hr
                </option>
                <option value="david">
                  Coach David Chen – Basketball Tactician – PKR 1200/hr
                </option>
                <option value="rachel">
                  Coach Rachel Kim – Yoga & Wellness – PKR 2500/hr
                </option>
                <option value="tony">
                  Coach Tony Edwards – Boxing & Strength – PKR 1600/hr
                </option>
              </select>
            </div>

            {coachDescription && (
              <div
                id="coach-description"
                style={{
                  marginBottom: "1.5rem",
                  color: "#2c3e50",
                  fontSize: "1rem",
                }}
              >
                {coachDescription}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="date">Session Date</label>
              <input type="date" id="date" required />
            </div>

            <div className="form-group">
              <label htmlFor="time">Session Time</label>
              <input type="time" id="time" required />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Special Requests (Optional)</label>
              <textarea
                id="notes"
                placeholder="Any specific areas you'd like to focus on..."
              />
            </div>

            <button type="submit" className="btn">
              <i className="fas fa-lock"></i> Confirm & Pay
            </button>
          </form>

          <a href="athlete_dashboard.html">
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: "#7f8c8d", marginTop: "1rem" }}
            >
              <i className="fas fa-times-circle"></i> Cancel Booking
            </button>
          </a>
        </div>
      </main>

      {/* Footer */}
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

      {/* Styles */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Arial", sans-serif;
        }
        .body {
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

        .booking-container {
          padding: 140px 5% 60px;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .booking-heading {
          font-size: 2.2rem;
          color: white;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 15px;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
          text-align: center;
        }
        .booking-form {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #e74c3c;
          width: 100%;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
        }
        .form-group select,
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 2px solid #e1e5eb;
          border-radius: 5px;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .form-group select:focus,
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #e74c3c;
          outline: none;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
        }
        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        .btn {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background-color: #e74c3c;
          color: white;
          border-radius: 5px;
          font-weight: 600;
          transition: background-color 0.3s, transform 0.2s;
          border: none;
          cursor: pointer;
          width: 100%;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .btn:hover {
          background-color: #c0392b;
          transform: translateY(-2px);
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
          .booking-container {
            padding: 120px 5% 40px;
          }
          .booking-heading {
            font-size: 1.8rem;
          }
        }
        @media (max-width: 576px) {
          .footer-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          .booking-heading {
            font-size: 1.5rem;
          }
          .booking-form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
