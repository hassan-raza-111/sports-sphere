// React version of feedback.html
import React, { useState } from 'react';


const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback! We appreciate your input.');
    setFeedbackType('');
    setSelectedCoach('');
    setRating(0);
    setFeedbackText('');
    setEmail('');
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <a href="../index.html" style={styles.logo}>
          <img src="../../assests/images/Logo.png" alt="Logo" style={styles.logoImg} />
          <div>
            <div style={styles.logoText}>Sports Sphere</div>
            <div style={styles.logoTagline}>Your All-in-One Sports Hub</div>
          </div>
        </a>
        <nav style={styles.nav}>
          <a href="../index.html" style={styles.navLink}><FaHome /> Home</a>
          <a href="../athlete/athlete.html" style={styles.navLink}><FaTachometerAlt /> Dashboard</a>
          <a href="progress.html" style={styles.navLink}><FaChartLine /> Progress</a>
        </nav>
      </header>

      <main style={styles.container}>
        <div style={styles.headerBox}>
          <h2 style={styles.heading}><FaCommentAlt /> Share Your Feedback</h2>
          <p style={styles.description}>Your opinion helps us improve our platform and services for all athletes and coaches.</p>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label>Feedback Type</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                required
                style={styles.input}
              >
                <option value="" disabled>Select feedback type</option>
                <option value="coach">Coach Feedback</option>
                <option value="platform">Platform Feedback</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            {feedbackType === 'coach' && (
              <div style={styles.formGroup}>
                <label>Select Coach</label>
                <select
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  style={styles.input}
                >
                  <option value="" disabled>Choose a coach</option>
                  <option value="sarah">Coach Sarah Williams</option>
                  <option value="mike">Coach Michael Johnson</option>
                  <option value="jessica">Coach Jessica Lee</option>
                </select>
              </div>
            )}

            <div style={styles.formGroup}>
              <label>Rating</label>
              <div style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      ...styles.star,
                      color: rating >= star ? '#e74c3c' : '#ddd'
                    }}
                  />
                ))}
              </div>
              <div style={styles.ratingLabels}>
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label>Your Feedback</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
                placeholder="Please share your experience, suggestions, or any issues you encountered..."
                style={{ ...styles.input, minHeight: '150px', resize: 'vertical' }}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email if you'd like a response"
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.submitBtn}><FaPaperPlane /> Submit Feedback</button>
          </form>
        </div>

        <div style={styles.testimonials}>
          <h3 style={styles.testimonialsHeading}><FaQuoteLeft /> What Others Are Saying</h3>

          <div style={styles.testimonialCard}>
            <div style={styles.testimonialMeta}>
              <span><strong>Alex M.</strong> - Competitive Runner</span>
              <span style={styles.testimonialRating}>{Array(5).fill().map((_, i) => <FaStar key={i} />)}</span>
            </div>
            <p style={styles.testimonialText}>
              "The coaching platform completely transformed my training. My coach was able to identify areas for improvement I never noticed, and my 5K time dropped by 2 minutes in just 3 months!"
            </p>
          </div>

          <div style={styles.testimonialCard}>
            <div style={styles.testimonialMeta}>
              <span><strong>Jamie T.</strong> - Tennis Player</span>
              <span style={styles.testimonialRating}>{Array(5).fill().map((_, i) => <FaStar key={i} />)}</span>
            </div>
            <p style={styles.testimonialText}>
              "I love how easy it is to track progress and communicate with my coach. The video analysis tools helped me correct my serve technique and add 15mph to my serve speed."
            </p>
          </div>
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
    minHeight: '100vh',
    paddingBottom: '3rem'
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
  logoTagline: { fontSize: '0.8rem', color: '#7f8c8d', marginTop: 3 },
  nav: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  navLink: { fontWeight: 600, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 5 },
  container: { maxWidth: 800, margin: '140px auto 60px', padding: '0 5%' },
  headerBox: { textAlign: 'center', marginBottom: 40 },
  heading: { fontSize: '2.2rem', color: 'white', marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: 15, textShadow: '1px 1px 3px rgba(0,0,0,0.5)' },
  description: { color: '#ddd', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' },
  card: { background: 'rgba(255, 255, 255, 0.95)', borderRadius: 10, padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: 40 },
  formGroup: { marginBottom: '1.5rem' },
  input: { width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: 5, fontSize: '1rem' },
  ratingContainer: { display: 'flex', gap: 10, marginBottom: '0.5rem' },
  star: { fontSize: '2rem', cursor: 'pointer', transition: '0.2s' },
  ratingLabels: { display: 'flex', justifyContent: 'space-between', color: '#7f8c8d', fontSize: '0.9rem' },
  submitBtn: { width: '100%', padding: '1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: 5, fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 },
  testimonials: { marginTop: '3rem' },
  testimonialsHeading: { fontSize: '1.8rem', color: 'white', marginBottom: '2rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 15, textShadow: '1px 1px 3px rgba(0,0,0,0.5)' },
  testimonialCard: { background: 'rgba(255, 255, 255, 0.95)', borderRadius: 10, padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '1.5rem', borderLeft: '4px solid #e74c3c' },
  testimonialMeta: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: '#7f8c8d' },
  testimonialRating: { color: '#e74c3c' },
  testimonialText: { lineHeight: 1.6, color: '#2c3e50' },
  footer: { backgroundColor: 'rgba(44, 62, 80, 0.9)', color: 'white', padding: '2rem 5%', marginTop: '3rem' },
  footerContent: { maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerLogo: { fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10 },
  copyright: { fontSize: '0.9rem' }
};

export default Feedback;
