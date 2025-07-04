import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import logoImg from '../../assets/images/Logo.png';

const AthleteProgress = () => {
  const chartRef = useRef(null);
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [overview, setOverview] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTimeframe, setActiveTimeframe] = useState('quarter');
  const [performanceChart, setPerformanceChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AthleteProgress component mounted');
  }, []);

  // Fetch all athletes on mount
  useEffect(() => {
    fetch('/api/progress/athletes')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched athletes:', data);
        setAthletes(data);
        if (data.length > 0) setSelectedAthlete(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load athletes');
        setLoading(false);
      });
  }, []);

  // Fetch all data for selected athlete
  useEffect(() => {
    if (!selectedAthlete) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/progress/athlete/${selectedAthlete._id}/overview`).then((r) =>
        r.json()
      ),
      fetch(`/api/progress/athlete/${selectedAthlete._id}/metrics`).then((r) =>
        r.json()
      ),
      fetch(`/api/progress/athlete/${selectedAthlete._id}/history`).then((r) =>
        r.json()
      ),
    ])
      .then(([overviewData, metricsData, historyData]) => {
        setOverview(overviewData);
        setMetrics(metricsData);
        setHistory(historyData);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load athlete data');
        setLoading(false);
      });
  }, [selectedAthlete]);

  // Chart.js integration
  useEffect(() => {
    if (!metrics || !chartRef.current || !metrics.labels) return;
    if (performanceChart) performanceChart.destroy();
    const newChart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: metrics.labels,
        datasets: [
          {
            label: 'Serve Accuracy',
            data: metrics.serveAccuracy,
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Backhand Power',
            data: metrics.backhandPower,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Footwork Speed',
            data: metrics.footworkSpeed,
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
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
              callback: (value) => `${value}%`,
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
          },
          x: { grid: { display: false } },
        },
      },
    });
    setPerformanceChart(newChart);
    // eslint-disable-next-line
  }, [metrics]);

  // Timeframe filter for chart (for demo, just slice data)
  const handleTimeframe = (tf) => {
    setActiveTimeframe(tf);
    if (!metrics) return;
    let count = metrics.labels.length;
    if (tf === 'month') count = 4;
    else if (tf === 'quarter') count = 3;
    else if (tf === 'half') count = 6;
    else if (tf === 'year') count = 12;
    const newMetrics = {
      labels: metrics.labels.slice(-count),
      serveAccuracy: metrics.serveAccuracy.slice(-count),
      backhandPower: metrics.backhandPower.slice(-count),
      footworkSpeed: metrics.footworkSpeed.slice(-count),
      stamina: metrics.stamina ? metrics.stamina.slice(-count) : [],
    };
    setMetrics(newMetrics);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        Loading athlete progress...
      </div>
    );
  }

  // Only show error if athletes array is empty
  if (athletes.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: '#e74c3c' }}>
        No athletes found in the system.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover",
        color: '#333',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 5%',
          background: 'rgba(255,255,255,0.95)',
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <a
          href='/'
          className='logo'
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <img
            src={logoImg}
            alt='Sport Sphere Logo'
            className='logo-img'
            style={{ height: 40 }}
          />
          <div
            className='logo-text'
            style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#2c3e50',
              fontStyle: 'italic',
            }}
          >
            Sports Sphere
          </div>
        </a>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href='/' style={{ fontWeight: 600, color: '#2c3e50' }}>
            <i className='fas fa-home'></i> Home
          </a>
          <a href='/athlete' style={{ fontWeight: 600, color: '#2c3e50' }}>
            <i className='fas fa-user-shield'></i> Dashboard
          </a>
          <a
            href='/message'
            style={{ fontWeight: 600, color: '#2c3e50', position: 'relative' }}
          >
            <i className='fas fa-envelope'></i> Messages{' '}
            <span
              className='notification-badge'
              style={{
                background: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                fontSize: '0.7rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 5,
              }}
            >
              3
            </span>
          </a>
          <a
            href='/athelte-profile'
            className='profile-btn'
            style={{
              background: '#e74c3c',
              color: 'white',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className='fas fa-user-tie'></i>
          </a>
        </nav>
      </header>
      <main
        className='analytics-container'
        style={{ maxWidth: 1200, margin: '140px auto 60px', padding: '0 5%' }}
      >
        <h2
          className='analytics-heading'
          style={{
            fontSize: '2.2rem',
            color: 'white',
            marginBottom: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 15,
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          <i className='fas fa-chart-line'></i> Athlete Progress Analysis
        </h2>
        {/* Athlete Selector */}
        <div
          className='athlete-selector'
          style={{
            background: 'rgba(255,255,255,0.95)',
            padding: 20,
            borderRadius: 10,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginBottom: 30,
          }}
        >
          <div
            className='athlete-selector-header'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <h3
              className='athlete-selector-title'
              style={{
                fontSize: '1.5rem',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <i className='fas fa-users' style={{ color: '#e74c3c' }}></i>{' '}
              Select Athlete
            </h3>
          </div>
          <div
            className='athlete-grid'
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 15,
            }}
          >
            {athletes.length === 0 ? (
              <div
                style={{
                  gridColumn: '1/-1',
                  textAlign: 'center',
                  color: '#e74c3c',
                }}
              >
                No athletes found.
              </div>
            ) : (
              athletes.map((ath) => (
                <div
                  key={ath._id}
                  className={`athlete-card${
                    selectedAthlete && ath._id === selectedAthlete._id
                      ? ' active'
                      : ''
                  }`}
                  style={{
                    background: '#f8f9fa',
                    borderRadius: 8,
                    padding: 15,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 15,
                    cursor: 'pointer',
                    borderLeft:
                      ath._id === selectedAthlete?._id
                        ? '3px solid #e74c3c'
                        : '3px solid transparent',
                    backgroundColor:
                      ath._id === selectedAthlete?._id ? 'white' : '#f8f9fa',
                  }}
                  onClick={() => setSelectedAthlete(ath)}
                >
                  <img
                    src={`https://randomuser.me/api/portraits/lego/${ath._id.slice(
                      -1
                    )}.jpg`}
                    alt={ath.name}
                    className='athlete-avatar'
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <div className='athlete-info'>
                    <h4
                      style={{
                        fontSize: '1rem',
                        color: '#2c3e50',
                        marginBottom: 3,
                      }}
                    >
                      {ath.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                      {ath.preferredSport || 'Athlete'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Overview Cards */}
        <div
          className='analytics-grid'
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginBottom: 30,
          }}
        >
          {overview ? (
            <>
              <div
                className='analytics-card'
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  padding: 25,
                  borderRadius: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  borderLeft: '4px solid #e74c3c',
                }}
              >
                <i className='fas fa-calendar-check'></i>
                <h4>{overview.completedSessions}</h4>
                <p>Completed Sessions</p>
                <div
                  className='trend-indicator trend-up'
                  style={{
                    color: '#27ae60',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 8,
                    fontSize: '0.85rem',
                  }}
                >
                  <i className='fas fa-arrow-up'></i> {overview.trendSessions}%
                  from last month
                </div>
              </div>
              <div
                className='analytics-card'
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  padding: 25,
                  borderRadius: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  borderLeft: '4px solid #e74c3c',
                }}
              >
                <i className='fas fa-trophy'></i>
                <h4>{overview.goalCompletion}%</h4>
                <p>Goal Completion</p>
                <div
                  className='trend-indicator trend-up'
                  style={{
                    color: '#27ae60',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 8,
                    fontSize: '0.85rem',
                  }}
                >
                  <i className='fas fa-arrow-up'></i> {overview.trendGoal}% from
                  last month
                </div>
              </div>
              <div
                className='analytics-card'
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  padding: 25,
                  borderRadius: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  borderLeft: '4px solid #e74c3c',
                }}
              >
                <i className='fas fa-running'></i>
                <h4>{overview.avgPerformance}</h4>
                <p>Average Performance</p>
                <div
                  className='trend-indicator trend-up'
                  style={{
                    color: '#27ae60',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 8,
                    fontSize: '0.85rem',
                  }}
                >
                  <i className='fas fa-arrow-up'></i>{' '}
                  {overview.trendPerformance} from last month
                </div>
              </div>
              <div
                className='analytics-card'
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  padding: 25,
                  borderRadius: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  borderLeft: '4px solid #e74c3c',
                }}
              >
                <i className='fas fa-heartbeat'></i>
                <h4>{overview.attendance}%</h4>
                <p>Attendance Rate</p>
                <div
                  className='trend-indicator trend-down'
                  style={{
                    color: '#e74c3c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 8,
                    fontSize: '0.85rem',
                  }}
                >
                  <i className='fas fa-arrow-down'></i>{' '}
                  {overview.trendAttendance}% from last month
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                gridColumn: '1/-1',
                textAlign: 'center',
                color: '#e74c3c',
              }}
            >
              No overview data found for this athlete.
            </div>
          )}
        </div>
        {/* Performance Progress Chart */}
        <div
          className='chart-section'
          style={{
            marginTop: 40,
            background: 'rgba(255,255,255,0.95)',
            padding: 25,
            borderRadius: 10,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          }}
        >
          <div
            className='chart-header'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <h3
              className='chart-title'
              style={{
                fontSize: '1.5rem',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <i className='fas fa-chart-line' style={{ color: '#e74c3c' }}></i>{' '}
              Performance Progress
            </h3>
            <div className='time-selector' style={{ display: 'flex', gap: 10 }}>
              {['month', 'quarter', 'half', 'year'].map((t) => (
                <button
                  key={t}
                  className={`time-btn${
                    activeTimeframe === t ? ' active' : ''
                  }`}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 4,
                    fontSize: '0.85rem',
                    background: activeTimeframe === t ? '#e74c3c' : '#f8f9fa',
                    color: activeTimeframe === t ? 'white' : '#333',
                    border:
                      activeTimeframe === t
                        ? '1px solid #e74c3c'
                        : '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleTimeframe(t)}
                >
                  {t === 'month'
                    ? '1M'
                    : t === 'quarter'
                    ? '3M'
                    : t === 'half'
                    ? '6M'
                    : '1Y'}
                </button>
              ))}
            </div>
          </div>
          <div
            className='chart-container'
            style={{ position: 'relative', height: 350, width: '100%' }}
          >
            {metrics && metrics.labels && metrics.labels.length ? (
              <canvas ref={chartRef}></canvas>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: '#e74c3c',
                  padding: '2rem',
                }}
              >
                No performance metrics found for this athlete.
              </div>
            )}
          </div>
        </div>
        {/* Key Metrics */}
        <div
          className='chart-section'
          style={{
            marginTop: 40,
            background: 'rgba(255,255,255,0.95)',
            padding: 25,
            borderRadius: 10,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          }}
        >
          <div
            className='chart-header'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <h3
              className='chart-title'
              style={{
                fontSize: '1.5rem',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <i
                className='fas fa-tachometer-alt'
                style={{ color: '#e74c3c' }}
              ></i>{' '}
              Key Performance Metrics
            </h3>
          </div>
          <div
            className='metrics-container'
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 20,
              marginTop: 20,
            }}
          >
            {metrics &&
            metrics.serveAccuracy &&
            metrics.serveAccuracy.length ? (
              <>
                <div
                  className='metric-card'
                  style={{
                    background: 'white',
                    borderRadius: 8,
                    padding: 15,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    className='metric-header'
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <span
                      className='metric-title'
                      style={{ fontWeight: 600, color: '#2c3e50' }}
                    >
                      Serve Accuracy
                    </span>
                    <span
                      className='metric-value'
                      style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      {metrics.serveAccuracy[metrics.serveAccuracy.length - 1]}%
                    </span>
                  </div>
                  <div
                    className='progress-bar'
                    style={{
                      height: 8,
                      background: '#eee',
                      borderRadius: 4,
                      marginTop: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className='progress-fill'
                      style={{
                        height: '100%',
                        background: '#e74c3c',
                        borderRadius: 4,
                        width:
                          metrics.serveAccuracy[
                            metrics.serveAccuracy.length - 1
                          ] + '%',
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  className='metric-card'
                  style={{
                    background: 'white',
                    borderRadius: 8,
                    padding: 15,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    className='metric-header'
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <span
                      className='metric-title'
                      style={{ fontWeight: 600, color: '#2c3e50' }}
                    >
                      Backhand Power
                    </span>
                    <span
                      className='metric-value'
                      style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      {metrics.backhandPower[metrics.backhandPower.length - 1]}%
                    </span>
                  </div>
                  <div
                    className='progress-bar'
                    style={{
                      height: 8,
                      background: '#eee',
                      borderRadius: 4,
                      marginTop: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className='progress-fill'
                      style={{
                        height: '100%',
                        background: '#e74c3c',
                        borderRadius: 4,
                        width:
                          metrics.backhandPower[
                            metrics.backhandPower.length - 1
                          ] + '%',
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  className='metric-card'
                  style={{
                    background: 'white',
                    borderRadius: 8,
                    padding: 15,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    className='metric-header'
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <span
                      className='metric-title'
                      style={{ fontWeight: 600, color: '#2c3e50' }}
                    >
                      Footwork Speed
                    </span>
                    <span
                      className='metric-value'
                      style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      {metrics.footworkSpeed[metrics.footworkSpeed.length - 1]}%
                    </span>
                  </div>
                  <div
                    className='progress-bar'
                    style={{
                      height: 8,
                      background: '#eee',
                      borderRadius: 4,
                      marginTop: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className='progress-fill'
                      style={{
                        height: '100%',
                        background: '#e74c3c',
                        borderRadius: 4,
                        width:
                          metrics.footworkSpeed[
                            metrics.footworkSpeed.length - 1
                          ] + '%',
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  className='metric-card'
                  style={{
                    background: 'white',
                    borderRadius: 8,
                    padding: 15,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    className='metric-header'
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <span
                      className='metric-title'
                      style={{ fontWeight: 600, color: '#2c3e50' }}
                    >
                      Stamina
                    </span>
                    <span
                      className='metric-value'
                      style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      {metrics.stamina && metrics.stamina.length
                        ? metrics.stamina[metrics.stamina.length - 1] + '%'
                        : 'N/A'}
                    </span>
                  </div>
                  <div
                    className='progress-bar'
                    style={{
                      height: 8,
                      background: '#eee',
                      borderRadius: 4,
                      marginTop: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className='progress-fill'
                      style={{
                        height: '100%',
                        background: '#e74c3c',
                        borderRadius: 4,
                        width:
                          metrics.stamina && metrics.stamina.length
                            ? metrics.stamina[metrics.stamina.length - 1] + '%'
                            : '0%',
                      }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  gridColumn: '1/-1',
                  textAlign: 'center',
                  color: '#e74c3c',
                }}
              >
                No key metrics found for this athlete.
              </div>
            )}
          </div>
        </div>
        {/* Session History Table */}
        <div
          className='chart-section'
          style={{
            marginTop: 40,
            background: 'rgba(255,255,255,0.95)',
            padding: 25,
            borderRadius: 10,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          }}
        >
          <div
            className='chart-header'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <h3
              className='chart-title'
              style={{
                fontSize: '1.5rem',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <i className='fas fa-history' style={{ color: '#e74c3c' }}></i>{' '}
              Session History
            </h3>
          </div>
          <table
            className='data-table'
            style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}
          >
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
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: 'center', color: '#888' }}
                  >
                    No session history found.
                  </td>
                </tr>
              ) : (
                history.map((s, i) => (
                  <tr key={i}>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                    <td>{s.duration}</td>
                    <td>{s.focusArea}</td>
                    <td>
                      {s.rating ? (
                        <>
                          <i
                            className='fas fa-star'
                            style={{ color: '#f1c40f' }}
                          ></i>{' '}
                          {s.rating}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{s.coachNotes || '-'}</td>
                    <td>
                      <span
                        className={`badge badge-${s.status}`}
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 12,
                          fontSize: 600,
                          background:
                            s.status === 'completed'
                              ? '#d4edda'
                              : s.status === 'missed'
                              ? '#f8d7da'
                              : '#fff3cd',
                          color:
                            s.status === 'completed'
                              ? '#155724'
                              : s.status === 'missed'
                              ? '#721c24'
                              : '#856404',
                        }}
                      >
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      <footer
        style={{
          backgroundColor: 'rgba(44,62,80,0.9)',
          color: 'white',
          padding: '2rem 5%',
          marginTop: '3rem',
        }}
      >
        <div
          className='footer-content'
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            className='footer-logo'
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <i className='fas fa-running'></i> Sport Sphere
          </div>
          <div className='copyright' style={{ fontSize: '0.9rem' }}>
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AthleteProgress;
