import React, { useState } from "react";

const FeedbackApp = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [ratingValue, setRatingValue] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [activeStars, setActiveStars] = useState(0);

  const handleStarClick = (value) => {
    setActiveStars(value);
    setRatingValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback!");
    setFeedbackType("");
    setFeedbackText("");
    setUserEmail("");
    setActiveStars(0);
    setRatingValue("");
  };

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
            <div className="logo-tagline">Your All-in-One Sports Hub</div>
          </div>
        </a>
        <nav>
          <a href="index.html">
            <i className="fas fa-home"></i> <span>Home</span>
          </a>
          <a href="athlete_dashboard.html">
            <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span>
          </a>
          <a href="progress.html">
            <i className="fas fa-chart-line"></i> <span>Progress</span>
          </a>
        </nav>
      </header>

      <main className="feedback-container">
        <div className="feedback-header">
          <h2>
            <i className="fas fa-comment-alt"></i> Share Your Feedback
          </h2>
          <p>
            Your opinion helps us improve our platform and services for all
            athletes and coaches.
          </p>
        </div>

        <div className="feedback-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="feedbackType">Feedback Type</label>
              <select
                id="feedbackType"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                required
              >
                <option value="" disabled selected>
                  Select feedback type
                </option>
                <option value="coach">Coach Feedback</option>
                <option value="platform">Platform Feedback</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            {feedbackType === "coach" && (
              <div className="form-group">
                <label htmlFor="coachSelect">Select Coach</label>
                <select id="coachSelect">
                  <option value="" disabled selected>
                    Choose a coach
                  </option>
                  <option value="sarah">Coach Sarah Williams</option>
                  <option value="mike">Coach Michael Johnson</option>
                  <option value="jessica">Coach Jessica Lee</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Rating</label>
              <div className="rating-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fas fa-star rating-star ${
                      star <= activeStars ? "active" : ""
                    }`}
                    onClick={() => handleStarClick(star)}
                    style={{ cursor: "pointer" }}
                  ></i>
                ))}
              </div>
              <div className="rating-labels">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
              <input type="hidden" value={ratingValue} name="rating" required />
            </div>

            <div className="form-group">
              <label htmlFor="feedbackText">Your Feedback</label>
              <textarea
                id="feedbackText"
                placeholder="Please share your experience, suggestions, or any issues you encountered..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="userEmail">Email (Optional)</label>
              <input
                type="email"
                id="userEmail"
                placeholder="Your email if you'd like a response"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn">
              <i className="fas fa-paper-plane"></i> Submit Feedback
            </button>
          </form>
        </div>

        <div className="testimonials">
          <h3>
            <i className="fas fa-quote-left"></i> What Others Are Saying
          </h3>
          <div className="testimonial-card">
            <div className="testimonial-meta">
              <span>
                <strong>Alex M.</strong> - Competitive Runner
              </span>
              <span className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </span>
            </div>
            <div className="testimonial-content">
              <p>
                "The coaching platform completely transformed my training. My
                coach was able to identify areas for improvement I never
                noticed, and my 5K time dropped by 2 minutes in just 3 months!"
              </p>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-meta">
              <span>
                <strong>Jamie T.</strong> - Tennis Player
              </span>
              <span className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </span>
            </div>
            <div className="testimonial-content">
              <p>
                "I love how easy it is to track progress and communicate with my
                coach. The video analysis tools helped me correct my serve
                technique and add 15mph to my serve speed."
              </p>
            </div>
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

export default FeedbackApp;
