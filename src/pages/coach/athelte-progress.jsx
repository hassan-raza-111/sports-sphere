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
} from 'react-icons/fa';
import '../../css/coach-athlete-progress.css';

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
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedAthlete) return;
    setLoading(true);
    Promise.all([
      fetch(
        `/api/progress/athletes/${selectedAthlete._id}/progress-overview`
      ).then((r) => r.json()),
      fetch(
        `/api/progress/athletes/${selectedAthlete._id}/progress-chart`
      ).then((r) => r.json()),
      fetch(`/api/progress/athletes/${selectedAthlete._id}/metrics`).then((r) =>
        r.json()
      ),
      fetch(`/api/progress/athletes/${selectedAthlete._id}/sessions`).then(
        (r) => r.json()
      ),
    ])
      .then(([overviewData, chartData, metricsData, sessionsData]) => {
        setOverview(overviewData);
        setChart(chartData);
        setMetrics(metricsData);
        setSessions(sessionsData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedAthlete?._id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        Loading athlete progress...
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        {error}
      </div>
    );
  }
  if (!athletes.length) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        No athletes found in the system.
      </div>
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
          </div>
          <div className='athlete-grid'>
            {athletes.map((athlete) => (
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
                <FaArrowUp /> {overview.trends.sessions}% from last month
              </div>
            </div>
            <div className='analytics-card'>
              <FaTrophy />
              <h4>{overview.goalCompletion}%</h4>
              <p>Goal Completion</p>
              <div className='trend-indicator trend-up'>
                <FaArrowUp /> {overview.trends.goals}% from last month
              </div>
            </div>
            <div className='analytics-card'>
              <FaRunning />
              <h4>{overview.avgPerformance}</h4>
              <p>Average Performance</p>
              <div className='trend-indicator trend-up'>
                <FaArrowUp /> {overview.trends.performance} from last month
              </div>
            </div>
            <div className='analytics-card'>
              <FaHeartbeat />
              <h4>{overview.attendanceRate}%</h4>
              <p>Attendance Rate</p>
              <div
                className={`trend-indicator ${
                  overview.trends.attendance >= 0 ? 'trend-up' : 'trend-down'
                }`}
              >
                {overview.trends.attendance >= 0 ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}{' '}
                {Math.abs(overview.trends.attendance)}% from last month
              </div>
            </div>
          </div>
        )}
        {/* Performance Progress Chart */}
        {chartData && (
          <div className='chart-section'>
            <div className='chart-header'>
              <h3 className='chart-title'>
                <FaChartLine /> Performance Progress
              </h3>
              {/* Timeframe buttons can be implemented for real filtering if backend supports */}
            </div>
            <div className='chart-container' style={{ height: 350 }}>
              <Line
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        )}
        {/* Key Metrics Section */}
        {metrics && metrics.length > 0 && (
          <div className='chart-section'>
            <div className='chart-header'>
              <h3 className='chart-title'>
                <FaTrophy /> Key Performance Metrics
              </h3>
            </div>
            <div className='metrics-container'>
              {metrics.map((metric) => (
                <div className='metric-card' key={metric.title}>
                  <div className='metric-header'>
                    <span className='metric-title'>{metric.title}</span>
                    <span className='metric-value'>{metric.value}%</span>
                  </div>
                  <div className='progress-bar'>
                    <div
                      className='progress-fill'
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Session History */}
        {sessions && sessions.length > 0 && (
          <div className='chart-section'>
            <div className='chart-header'>
              <h3 className='chart-title'>
                <FaHistory /> Session History
              </h3>
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
                {sessions.map((s, i) => (
                  <tr key={i}>
                    <td>{s.date}</td>
                    <td>{s.duration}</td>
                    <td>{s.focus}</td>
                    <td>
                      {s.performance ? (
                        <>
                          <FaTrophy style={{ color: '#f1c40f' }} />{' '}
                          {s.performance}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{s.coachNotes}</td>
                    <td>
                      <span className={`badge badge-${s.status}`}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoachAthleteProgress;
