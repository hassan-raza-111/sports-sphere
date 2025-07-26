import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/feedback.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentAlt,
  faPaperPlane,
  faStar,
  faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../../config.js';

const FEEDBACK_TYPES = [
  { value: 'coach', label: 'Coach Feedback' },
  { value: 'platform', label: 'Platform Feedback' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'other', label: 'Other' },
];

const AthleteFeedback = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [coaches, setCoaches] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      setLoadingCoaches(true);
      try {
        const res = await fetch(`${API_BASE_URL}/coaches`);
        const data = await res.json();
        setCoaches(data);
      } catch (err) {
        setErrorMsg('Failed to load coaches.');
      } finally {
        setLoadingCoaches(false);
      }
    };
    fetchCoaches();
  }, []);

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoadingTestimonials(true);
      try {
        const res = await fetch(`${API_BASE_URL}/feedback`);
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        setErrorMsg('Failed to load testimonials.');
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackType,
          selectedCoach: feedbackType === 'coach' ? selectedCoach : '',
          rating,
          feedbackText,
          email,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      setSuccessMsg('Thank you for your feedback! We appreciate your input.');
      setFeedbackType('');
      setSelectedCoach('');
      setRating(0);
      setFeedbackText('');
      setEmail('');
      // Refresh testimonials
      const testimonialsRes = await fetch(`${API_BASE_URL}/feedback`);
      setTestimonials(await testimonialsRes.json());
    } catch (err) {
      setErrorMsg('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AthleteLayout>
      <div className='feedback-container'>
        <div className='feedback-header'>
          <h2>
            <FontAwesomeIcon icon={faCommentAlt} style={{ color: '#e74c3c' }} />{' '}
            Share Your Feedback
          </h2>
          <p>
            Your opinion helps us improve our platform and services for all
            athletes and coaches.
          </p>
        </div>
        <div className='feedback-card'>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='feedbackType'>Feedback Type</label>
              <select
                id='feedbackType'
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                required
              >
                <option value='' disabled>
                  Select feedback type
                </option>
                {FEEDBACK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            {feedbackType === 'coach' && (
              <div className='form-group'>
                <label htmlFor='coachSelect'>Select Coach</label>
                {loadingCoaches ? (
                  <div style={{ color: '#e74c3c' }}>Loading coaches...</div>
                ) : (
                  <select
                    id='coachSelect'
                    value={selectedCoach}
                    onChange={(e) => setSelectedCoach(e.target.value)}
                    required
                  >
                    <option value='' disabled>
                      Choose a coach
                    </option>
                    {coaches.map((coach) => (
                      <option key={coach._id} value={coach._id}>
                        {coach.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            <div className='form-group'>
              <label>Rating</label>
              <div className='rating-container'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fas fa-star rating-star ${
                      rating >= star ? 'active' : ''
                    }`}
                    onClick={() => setRating(star)}
                  ></i>
                ))}
              </div>
              <div className='rating-labels'>
                <span>Poor</span>
                <span>Excellent</span>
              </div>
              <input type='hidden' value={rating} name='rating' required />
            </div>
            <div className='form-group'>
              <label htmlFor='feedbackText'>Your Feedback</label>
              <textarea
                id='feedbackText'
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder='Please share your experience, suggestions, or any issues you encountered...'
                required
              ></textarea>
            </div>
            <div className='form-group'>
              <label htmlFor='userEmail'>Email (Optional)</label>
              <input
                type='email'
                id='userEmail'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email if you'd like a response"
              />
            </div>
            {errorMsg && (
              <div style={{ color: '#e74c3c', marginBottom: 10 }}>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ color: 'green', marginBottom: 10 }}>
                {successMsg}
              </div>
            )}
            <button type='submit' className='submit-btn' disabled={submitting}>
              <i className='fas fa-paper-plane'></i>{' '}
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
        <div className='testimonials'>
          <h3>
            <FontAwesomeIcon icon={faQuoteLeft} style={{ color: '#e74c3c' }} />{' '}
            What Others Are Saying
          </h3>
          {loadingTestimonials ? (
            <div style={{ color: '#e74c3c' }}>Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div style={{ color: '#7f8c8d' }}>No testimonials yet.</div>
          ) : (
            testimonials.map((t, idx) => (
              <div className='testimonial-card' key={t._id || idx}>
                <div className='testimonial-meta'>
                  <span>
                    <strong>
                      {t.email ? t.email.split('@')[0] : 'Anonymous'}
                    </strong>
                    {t.feedbackType === 'coach' && t.selectedCoach
                      ? ' - Coach Feedback'
                      : ''}
                  </span>
                  <span className='testimonial-rating'>
                    {[...Array(t.rating)].map((_, i) => (
                      <FontAwesomeIcon icon={faStar} key={i} />
                    ))}
                  </span>
                </div>
                <div className='testimonial-content'>
                  <p>"{t.feedbackText}"</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AthleteLayout>
  );
};

export default AthleteFeedback;
