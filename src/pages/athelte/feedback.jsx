import React, { useState } from 'react';
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

const AthleteFeedback = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

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
                <option value='coach'>Coach Feedback</option>
                <option value='platform'>Platform Feedback</option>
                <option value='feature'>Feature Request</option>
                <option value='other'>Other</option>
              </select>
            </div>

            {feedbackType === 'coach' && (
              <div className='form-group'>
                <label htmlFor='coachSelect'>Select Coach</label>
                <select
                  id='coachSelect'
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                >
                  <option value='' disabled>
                    Choose a coach
                  </option>
                  <option value='sarah'>Coach Sarah Williams</option>
                  <option value='mike'>Coach Michael Johnson</option>
                  <option value='jessica'>Coach Jessica Lee</option>
                </select>
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

            <button type='submit' className='submit-btn'>
              <i className='fas fa-paper-plane'></i> Submit Feedback
            </button>
          </form>
        </div>

        <div className='testimonials'>
          <h3>
            <FontAwesomeIcon icon={faQuoteLeft} style={{ color: '#e74c3c' }} />{' '}
            What Others Are Saying
          </h3>

          <div className='testimonial-card'>
            <div className='testimonial-meta'>
              <span>
                <strong>Alex M.</strong> - Competitive Runner
              </span>
              <span className='testimonial-rating'>
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </span>
            </div>
            <div className='testimonial-content'>
              <p>
                "The coaching platform completely transformed my training. My
                coach was able to identify areas for improvement I never
                noticed, and my 5K time dropped by 2 minutes in just 3 months!"
              </p>
            </div>
          </div>

          <div className='testimonial-card'>
            <div className='testimonial-meta'>
              <span>
                <strong>Jamie T.</strong> - Tennis Player
              </span>
              <span className='testimonial-rating'>
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </span>
            </div>
            <div className='testimonial-content'>
              <p>
                "I love how easy it is to track progress and communicate with my
                coach. The video analysis tools helped me correct my serve
                technique and add 15mph to my serve speed."
              </p>
            </div>
          </div>
        </div>
      </div>
    </AthleteLayout>
  );
};

export default AthleteFeedback;
