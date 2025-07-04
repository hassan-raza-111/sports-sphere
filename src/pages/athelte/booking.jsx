import React, { useState } from 'react';

const Booking = () => {
  const [selectedCoach, setSelectedCoach] = useState('');
  const [coachDescription, setCoachDescription] = useState('');

  const coachInfo = {
    sarah: "Coach Sarah Williams is a Tennis Specialist with over 10 years of experience coaching junior and professional players.",
    mike: "Coach Michael Johnson is a Football Strategist known for developing youth talent and tactical training.",
    jessica: "Coach Jessica Lee is a Swimming Expert focusing on stroke correction and endurance training.",
    david: "Coach David Chen is a Basketball Tactician who emphasizes team coordination and shooting skills.",
    rachel: "Coach Rachel Kim is a Yoga & Wellness coach who specializes in flexibility, mindfulness, and recovery.",
    tony: "Coach Tony Edwards is a Boxing & Strength coach with a strong focus on conditioning and technique."
  };

  const handleCoachChange = (e) => {
    const value = e.target.value;
    setSelectedCoach(value);
    setCoachDescription(coachInfo[value] || '');
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <a href="../index.html" style={styles.logo}>
          <img src="../../assests/images/Logo.png" alt="Sport Sphere Logo" style={styles.logoImg} />
          <div style={styles.logoText}>Sports Sphere</div>
        </a>
        <nav style={styles.nav}>
          <a href="athlete.html" style={styles.navLink}><FaTachometerAlt /> Dashboard</a>
          <a href="../index.html" style={styles.navLink}><FaHome /> Home</a>
          <a href="message.html" style={styles.navLink}><FaEnvelope /> Messages <span style={styles.badge}>3</span></a>
          <a href="athelte-profile.html" style={styles.profileBtn}><FaUser /></a>
        </nav>
      </header>

      <main style={styles.bookingContainer}>
        <h2 style={styles.bookingHeading}><FaCalendarCheck /> Book a Session</h2>

        <div style={styles.bookingForm}>
          <form>
            <div style={styles.formGroup}>
              <label htmlFor="coach">Select Coach</label>
              <select id="coach" required onChange={handleCoachChange} value={selectedCoach} style={styles.input}>
                <option value="" disabled>Choose a coach</option>
                <option value="sarah">Coach Sarah Williams – Tennis Specialist – PKR 2700/hr</option>
                <option value="mike">Coach Michael Johnson – Football Strategist – PKR 1300/hr</option>
                <option value="jessica">Coach Jessica Lee – Swimming Expert – PKR 1000/hr</option>
                <option value="david">Coach David Chen – Basketball Tactician – PKR 1200/hr</option>
                <option value="rachel">Coach Rachel Kim – Yoga & Wellness – PKR 2500/hr</option>
                <option value="tony">Coach Tony Edwards – Boxing & Strength – PKR 1600/hr</option>
              </select>
            </div>

            {coachDescription && <div style={styles.description}>{coachDescription}</div>}

            <div style={styles.formGroup}>
              <label htmlFor="date">Session Date</label>
              <input type="date" id="date" required style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="time">Session Time</label>
              <input type="time" id="time" required style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="notes">Special Requests (Optional)</label>
              <textarea id="notes" placeholder="Any specific areas you'd like to focus on..." style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }} />
            </div>

            <button type="submit" style={styles.btn}><FaLock /> Confirm & Pay</button>
          </form>

          <a href="athlete_dashboard.html">
            <button type="button" style={{ ...styles.btn, backgroundColor: '#7f8c8d', marginTop: '1rem' }}>
              <FaTimesCircle /> Cancel Booking
            </button>
          </a>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}><FaRunning /> Sport Sphere</div>
          <div style={styles.copyright}>© 2025 Sport Sphere. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    lineHeight: 1.6,
    background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover`,
    minHeight: '100vh'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.5rem 5%', backgroundColor: 'rgba(255, 255, 255, 0.95)',
    position: 'fixed', width: '100%', top: 0, zIndex: 100,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoImg: { height: 40, width: 'auto' },
  logoText: { fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50', fontStyle: 'italic' },
  nav: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  navLink: { fontWeight: 600, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 5 },
  badge: { backgroundColor: '#e74c3c', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 5 },
  profileBtn: { backgroundColor: '#e74c3c', color: 'white', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bookingContainer: { padding: '140px 5% 60px', maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  bookingHeading: { fontSize: '2.2rem', color: 'white', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 15, textShadow: '1px 1px 3px rgba(0,0,0,0.5)', textAlign: 'center' },
  bookingForm: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 10, padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderLeft: '4px solid #e74c3c', width: '100%' },
  formGroup: { marginBottom: '1.5rem' },
  input: { width: '100%', padding: '0.8rem 1rem', border: '2px solid #e1e5eb', borderRadius: 5, fontSize: '1rem' },
  btn: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.8rem 1.5rem', backgroundColor: '#e74c3c', color: 'white', borderRadius: 5, fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '1.1rem', gap: 10, width: '100%' },
  footer: { backgroundColor: 'rgba(44, 62, 80, 0.9)', color: 'white', padding: '2rem 5%', marginTop: '3rem' },
  footerContent: { maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerLogo: { fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10 },
  description: { marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1rem' },
  copyright: { fontSize: '0.9rem' }
};

export default Booking;
