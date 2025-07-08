import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Line } from 'react-chartjs-2';
import {
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaTrophy,
  FaRunning,
  FaHeartbeat,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaTachometerAlt,
} from 'react-icons/fa';
import '../../css/coach-athlete-progress.css';

const timeframes = [
  { key: 'month', label: '1M' },
  { key: 'quarter', label: '3M' },
  { key: 'half', label: '6M' },
  { key: 'year', label: '1Y' },
];
const sessionTimeframes = [
  { key: 'month', label: '1M' },
  { key: 'quarter', label: '3M' },
  { key: 'year', label: '1Y' },
  { key: 'all', label: 'All' },
];

const CoachAthleteProgress = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [overview, setOverview] = useState(null);
  const [chart, setChart] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState('quarter');
  const [sessionFilter, setSessionFilter] = useState('quarter');
  const [athleteSearch, setAthleteSearch] = useState('');

  // Fetch athletes on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/progress/athletes')
      .then((res) => res.json())
      .then((data) => {
        setAthletes(data);
        setSelectedAthlete(
          (prev) => prev || (data.length > 0 ? data[0] : null)
        );
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load athletes');
        setLoading(false);
      });
  }, []);

  // Fetch all data for selected athlete and timeframe
  useEffect(() => {
    if (!selectedAthlete) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(
        `/api/progress/athletes/${selectedAthlete._id}/progress-overview?timeframe=${activeTimeframe}`
      ).then((r) => r.json()),
      fetch(
        `/api/progress/athletes/${selectedAthlete._id}/progress-chart?timeframe=${activeTimeframe}`
      ).then((r) => r.json()),
      fetch(`/api/progress/athletes/${selectedAthlete._id}/metrics`).then((r) =>
        r.json()
      ),
      fetch(
        `/api/progress/athletes/${selectedAthlete._id}/sessions?timeframe=${sessionFilter}`
      ).then((r) => r.json()),
    ])
      .then(([overviewData, chartData, metricsData, sessionsData]) => {
        setOverview(overviewData);
        setChart(chartData);
        setMetrics(metricsData);
        setSessions(sessionsData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load athlete progress data');
        setLoading(false);
      });
  }, [selectedAthlete, activeTimeframe, sessionFilter]);

  if (loading) {
    return (
      <Layout role='coach'>
        <div
          style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}
        >
          Loading athlete progress...
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout role='coach'>
        <div
          style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}
        >
          {error}
        </div>
      </Layout>
    );
  }
  if (!athletes.length) {
    return (
      <Layout role='coach'>
        <div
          style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}
        >
          No athletes found in the system.
        </div>
      </Layout>
    );
  }

  // Chart.js data
  const chartData = chart
    ? {
        labels: chart.labels,
        datasets: [
          {
            label: 'Technical Skills',
            data: chart.technical,
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Physical Conditioning',
            data: chart.physical,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Mental Toughness',
            data: chart.mental,
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <Layout role='coach'>
      <div className='analytics-container'>
        <h2 className='analytics-heading'>
          <FaChartLine /> Athlete Progress Analysis
        </h2>
        {/* Athlete Selector */}
        <div className='athlete-selector'>
          <div className='athlete-selector-header'>
            <h3 className='athlete-selector-title'>
              <FaUsers /> Select Athlete
            </h3>
            <div className='search-athlete'>
              <i className='fas fa-search'></i>
              <input
                type='text'
                placeholder='Search athlete...'
                value={athleteSearch}
                onChange={(e) => setAthleteSearch(e.target.value)}
              />
            </div>
          </div>
          <div className='athlete-grid'>
            {athletes
              .filter((a) =>
                a.name.toLowerCase().includes(athleteSearch.toLowerCase())
              )
              .map((athlete) => (
                <div
                  key={athlete._id}
                  className={`athlete-card${
                    selectedAthlete && selectedAthlete._id === athlete._id
                      ? ' active'
                      : ''
                  }`}
                  onClick={() => setSelectedAthlete(athlete)}
                >
                  <img
                    src={
                      athlete.profileImage ||
                      'https://randomuser.me/api/portraits/men/32.jpg'
                    }
                    alt={athlete.name}
                    className='athlete-avatar'
                  />
                  <div className='athlete-info'>
                    <h4>{athlete.name}</h4>
                    <p>{athlete.sport}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* Overview Cards */}
        {overview && (
          <div className='analytics-grid'>
            <div className='analytics-card'>
              <FaCalendarCheck />
              <h4>{overview.completedSessions}</h4>
              <p>Completed Sessions</p>
              <div className='trend-indicator trend-up'>
                <FaArrowUp /> {overview.trends?.sessions}% from last month
              </div>
            </div>
            <div className='analytics-card'>
              <FaTrophy />
              <h4>{overview.goalCompletion}%</h4>
              <p>Goal Completion</p>
              <div className='trend-indicator trend-up'>
                <FaArrowUp /> {overview.trends?.goals}% from last month
              </div>
            </div>
            <div className='analytics-card'>
              <FaRunning />
              <h4>{overview.avgPerformance}</h4>
              <p>Average Performance</p>
              <div className='trend-indicator trend-up'>
                <FaArrowUp /> {overview.trends?.performance} from last month
              </div>
            </div>
            <div className='analytics-card'>
              <FaHeartbeat />
              <h4>{overview.attendanceRate}%</h4>
              <p>Attendance Rate</p>
              <div
                className={`trend-indicator ${
                  overview.trends?.attendance < 0 ? 'trend-down' : 'trend-up'
                }`}
              >
                {overview.trends?.attendance < 0 ? (
                  <FaArrowDown />
                ) : (
                  <FaArrowUp />
                )}{' '}
                {Math.abs(overview.trends?.attendance)}% from last month
              </div>
            </div>
          </div>
        )}
        {/* Performance Progress Chart */}
        <div className='chart-section'>
          <div className='chart-header'>
            <h3 className='chart-title'>
              <FaChartLine /> Performance Progress
            </h3>
            <div className='time-selector'>
              {timeframes.map((tf) => (
                <button
                  key={tf.key}
                  className={`time-btn${
                    activeTimeframe === tf.key ? ' active' : ''
                  }`}
                  onClick={() => setActiveTimeframe(tf.key)}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
          <div className='chart-container'>
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false },
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 100,
                      ticks: {
                        callback: (value) => value + '%',
                      },
                      grid: { color: 'rgba(0,0,0,0.05)' },
                    },
                    x: { grid: { display: false } },
                  },
                }}
                height={350}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#e74c3c' }}>
                No chart data
              </div>
            )}
          </div>
        </div>
        {/* Key Metrics Section */}
        <div className='chart-section'>
          <div className='chart-header'>
            <h3 className='chart-title'>
              <FaTachometerAlt /> Key Performance Metrics
            </h3>
          </div>
          <div className='metrics-container'>
            {metrics.length ? (
              metrics.map((metric, idx) => (
                <div className='metric-card' key={idx}>
                  <div className='metric-header'>
                    <span className='metric-title'>{metric.title}</span>
                    <span className='metric-value'>{metric.value}</span>
                  </div>
                  <div className='progress-bar'>
                    <div
                      className='progress-fill'
                      style={{ width: metric.value }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#e74c3c' }}>No metrics data</div>
            )}
          </div>
        </div>
        {/* Session History */}
        <div className='chart-section'>
          <div className='chart-header'>
            <h3 className='chart-title'>
              <FaHistory /> Session History
            </h3>
            <div className='time-selector'>
              {sessionTimeframes.map((tf) => (
                <button
                  key={tf.key}
                  className={`time-btn${
                    sessionFilter === tf.key ? ' active' : ''
                  }`}
                  onClick={() => setSessionFilter(tf.key)}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Duration</th>
                <th>Focus Area</th>
                <th>Performance</th>
                <th>Coach Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length ? (
                sessions.map((session, idx) => (
                  <tr key={idx}>
                    <td>{new Date(session.date).toLocaleDateString()}</td>
                    <td>{session.duration}</td>
                    <td>{session.focusArea}</td>
                    <td>
                      {session.performance ? (
                        <>
                          <i
                            className='fas fa-star'
                            style={{ color: '#f1c40f' }}
                          ></i>{' '}
                          {session.performance}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{session.notes || '-'}</td>
                    <td>
                      {session.status === 'completed' && (
                        <span className='badge badge-completed'>Completed</span>
                      )}
                      {session.status === 'missed' && (
                        <span className='badge badge-missed'>Missed</span>
                      )}
                      {session.status === 'upcoming' && (
                        <span className='badge badge-upcoming'>Upcoming</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: 'center', color: '#e74c3c' }}
                  >
                    No session data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default CoachAthleteProgress;
