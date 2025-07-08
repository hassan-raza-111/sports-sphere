import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faTachometerAlt,
  faEnvelope,
  faUser,
  faChartLine,
  faBolt,
  faDumbbell,
  faBrain,
  faChartBar,
  faCommentAlt,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/athlete-progress.css';

const AthleteProgress = () => {
  const [metrics, setMetrics] = useState(null);
  const [trend, setTrend] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return setError('User not logged in');
    const user = JSON.parse(userStr);
    if (!user || !user._id) return setError('User not found');
    const userId = user._id;
    setLoading(true);
    Promise.all([
      fetch(
        `http://localhost:5000/api/progress/athlete/${userId}/metrics-summary`
      ).then((r) => r.json()),
      fetch(
        `http://localhost:5000/api/progress/athlete/${userId}/metrics-trend`
      ).then((r) => r.json()),
      fetch(`http://localhost:5000/api/feedback/athlete/${userId}`).then((r) =>
        r.json()
      ),
    ])
      .then(([metricsData, trendData, feedbackData]) => {
        setMetrics(metricsData);
        setTrend(trendData);
        setFeedback(Array.isArray(feedbackData) ? feedbackData : []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load progress data');
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <AthleteLayout>
        <div className='progress-wrapper'>
          <div>Loading...</div>
        </div>
      </AthleteLayout>
    );
  if (error)
    return (
      <AthleteLayout>
        <div className='progress-wrapper'>
          <div>{error}</div>
        </div>
      </AthleteLayout>
    );

  // Helper for progress bar width
  const percent = (v) =>
    typeof v === 'number' ? `${Math.min(Math.max(v, 0), 100)}%` : '0%';

  return (
    <AthleteLayout>
      <div className='progress-wrapper'>
        <main className='progress-container'>
          <h2 className='progress-heading'>
            <FontAwesomeIcon icon={faChartLine} style={{ color: '#e74c3c' }} />{' '}
            My Training Progress
          </h2>
          <div className='metrics-grid'>
            <div className='metric-card'>
              <h3>
                <FontAwesomeIcon
                  icon={faTachometerAlt}
                  style={{ color: '#e74c3c' }}
                />{' '}
                Stamina
              </h3>
              <div className='metric-value'>
                {metrics?.stamina !== undefined ? `${metrics.stamina}%` : '-'}
              </div>
              <div className='metric-description'>
                Improvement in endurance over last 4 weeks
              </div>
              <div className='progress-bar'>
                <div
                  className='progress-fill'
                  style={{ width: percent(metrics?.stamina) }}
                ></div>
              </div>
            </div>
            <div className='metric-card'>
              <h3>
                <FontAwesomeIcon icon={faBolt} style={{ color: '#e74c3c' }} />{' '}
                Speed
              </h3>
              <div className='metric-value'>
                {metrics?.speed !== undefined ? `${metrics.speed}%` : '-'}
              </div>
              <div className='metric-description'>
                Average sprint time improvement
              </div>
              <div className='progress-bar'>
                <div
                  className='progress-fill'
                  style={{ width: percent(metrics?.speed) }}
                ></div>
              </div>
            </div>
            <div className='metric-card'>
              <h3>
                <FontAwesomeIcon
                  icon={faDumbbell}
                  style={{ color: '#e74c3c' }}
                />{' '}
                Strength
              </h3>
              <div className='metric-value'>
                {metrics?.strength !== undefined ? `${metrics.strength}%` : '-'}
              </div>
              <div className='metric-description'>
                Increase in max lifting capacity
              </div>
              <div className='progress-bar'>
                <div
                  className='progress-fill'
                  style={{ width: percent(metrics?.strength) }}
                ></div>
              </div>
            </div>
            <div className='metric-card'>
              <h3>
                <FontAwesomeIcon icon={faBrain} style={{ color: '#e74c3c' }} />{' '}
                Focus
              </h3>
              <div className='metric-value'>
                {metrics?.focus !== undefined ? `${metrics.focus}/10` : '-'}
              </div>
              <div className='metric-description'>
                Coach's latest focus rating
              </div>
              <div className='progress-bar'>
                <div
                  className='progress-fill'
                  style={{ width: percent(metrics?.focus * 10) }}
                ></div>
              </div>
            </div>
          </div>
          <section className='charts-section'>
            <h3>
              <FontAwesomeIcon icon={faChartBar} /> Performance Trends
            </h3>
            <div className='chart-container'>
              {/* You can use a chart library here. For now, show a placeholder with trend data. */}
              {trend && trend.labels && trend.labels.length > 0 ? (
                <table
                  style={{
                    width: '100%',
                    background: '#f8f9fa',
                    borderRadius: 8,
                  }}
                >
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Stamina</th>
                      <th>Speed</th>
                      <th>Strength</th>
                      <th>Focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trend.labels.map((label, idx) => (
                      <tr key={label}>
                        <td>{label}</td>
                        <td>{trend.stamina[idx]}</td>
                        <td>{trend.speed[idx]}</td>
                        <td>{trend.strength[idx]}</td>
                        <td>{trend.focus[idx]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='chart-placeholder'></div>
              )}
            </div>
            <div className='chart-legend'>
              <div className='legend-item'>
                <div
                  className='legend-color'
                  style={{ backgroundColor: '#e74c3c' }}
                ></div>{' '}
                Stamina
              </div>
              <div className='legend-item'>
                <div
                  className='legend-color'
                  style={{ backgroundColor: '#c0392b' }}
                ></div>{' '}
                Speed
              </div>
              <div className='legend-item'>
                <div
                  className='legend-color'
                  style={{ backgroundColor: '#2c3e50' }}
                ></div>{' '}
                Strength
              </div>
            </div>
          </section>
          <section className='feedback-section'>
            <h3>
              <FontAwesomeIcon icon={faCommentAlt} /> Coach's Feedback
            </h3>
            {feedback.length === 0 && <div>No feedback yet.</div>}
            {feedback.map((fb, idx) => (
              <div key={idx} className='feedback-card'>
                <div className='feedback-meta'>
                  <span>{fb.coach?.name || '-'}</span>
                  <span>
                    {fb.date ? new Date(fb.date).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className='feedback-content'>
                  <p>{fb.feedbackText}</p>
                </div>
              </div>
            ))}
            <div className='feedback-actions'>
              <Link to='/athlete/feedback' className='btn'>
                <FontAwesomeIcon icon={faEdit} /> Submit Your Feedback
              </Link>
            </div>
          </section>
        </main>
      </div>
    </AthleteLayout>
  );
};

export default AthleteProgress;
