import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  FaChartPie,
  FaChartLine,
  FaTable,
  FaArrowUp,
  FaArrowDown,
  FaUserPlus,
  FaRunning,
  FaChalkboardTeacher,
  FaCalendarCheck,
  FaStar,
  FaStore,
} from 'react-icons/fa';
import Chart from 'chart.js/auto';
import { API_BASE_URL } from '../../config.js';

const AdminReport = () => {
  const [analytics, setAnalytics] = useState({
    newSignups: { count: 0, trend: 0 },
    activeAthletes: { count: 0, trend: 0 },
    activeCoaches: { count: 0, trend: 0 },
    sessionsBooked: { count: 0, trend: 0 },
  });
  const [userGrowthData, setUserGrowthData] = useState({
    labels: [],
    datasets: [],
  });
  const [sportBreakdown, setSportBreakdown] = useState({
    labels: [],
    data: [],
    total: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('month');
  const [activePieTimeframe, setActivePieTimeframe] = useState('month');

  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    fetchAnalyticsData();
    fetchRecentSessions();
  }, []);

  useEffect(() => {
    fetchUserGrowthData();
  }, [activeTimeframe]);

  useEffect(() => {
    fetchSportBreakdown();
  }, [activePieTimeframe]);

  useEffect(() => {
    if (userGrowthData.labels.length > 0) {
      createLineChart();
    }
  }, [userGrowthData]);

  useEffect(() => {
    if (sportBreakdown.labels.length > 0) {
      createPieChart();
    }
  }, [sportBreakdown]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reports/analytics/overview`
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchUserGrowthData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reports/analytics/user-growth?timeframe=${activeTimeframe}`
      );
      const data = await response.json();
      setUserGrowthData(data);
    } catch (error) {
      console.error('Error fetching user growth data:', error);
    }
  };

  const fetchSportBreakdown = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reports/analytics/sport-breakdown?timeframe=${activePieTimeframe}`
      );
      const data = await response.json();
      setSportBreakdown(data);
    } catch (error) {
      console.error('Error fetching sport breakdown:', error);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reports/analytics/recent-sessions?limit=10`
      );
      const data = await response.json();
      setRecentSessions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
      setLoading(false);
    }
  };

  const createLineChart = () => {
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
    }

    const ctx = lineChartRef.current.getContext('2d');
    lineChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: userGrowthData.labels,
        datasets: [
          {
            label: 'New Users',
            data: userGrowthData.datasets[0]?.data || [],
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Active Users',
            data: userGrowthData.datasets[1]?.data || [],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
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
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  };

  const createPieChart = () => {
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }

    const ctx = pieChartRef.current.getContext('2d');
    pieChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: sportBreakdown.labels,
        datasets: [
          {
            data: sportBreakdown.data,
            backgroundColor: [
              '#e74c3c',
              '#3498db',
              '#2ecc71',
              '#f1c40f',
              '#9b59b6',
              '#e67e22',
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
        cutout: '70%',
      },
    });
  };

  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
  };

  const handlePieTimeframeChange = (timeframe) => {
    setActivePieTimeframe(timeframe);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderTrendIndicator = (trend) => {
    const isPositive = trend >= 0;
    return (
      <div
        className={`trend-indicator ${isPositive ? 'trend-up' : 'trend-down'}`}
      >
        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        {Math.abs(trend)}% from last month
      </div>
    );
  };

  return (
    <AdminLayout>
      <h2
        style={{
          fontSize: '2.2rem',
          color: 'white',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
        }}
      >
        <FaChartPie /> Platform Analytics Dashboard
      </h2>

      {/* Analytics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaUserPlus
            style={{
              fontSize: '2.2rem',
              color: '#e74c3c',
              marginBottom: '15px',
            }}
          />
          <h4
            style={{
              fontSize: '1.8rem',
              marginBottom: '5px',
              color: '#2c3e50',
            }}
          >
            {analytics.newSignups.count}
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#7f8c8d' }}>New Signups</p>
          {renderTrendIndicator(analytics.newSignups.trend)}
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaRunning
            style={{
              fontSize: '2.2rem',
              color: '#e74c3c',
              marginBottom: '15px',
            }}
          />
          <h4
            style={{
              fontSize: '1.8rem',
              marginBottom: '5px',
              color: '#2c3e50',
            }}
          >
            {analytics.activeAthletes.count}
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#7f8c8d' }}>
            Active Athletes
          </p>
          {renderTrendIndicator(analytics.activeAthletes.trend)}
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaChalkboardTeacher
            style={{
              fontSize: '2.2rem',
              color: '#e74c3c',
              marginBottom: '15px',
            }}
          />
          <h4
            style={{
              fontSize: '1.8rem',
              marginBottom: '5px',
              color: '#2c3e50',
            }}
          >
            {analytics.activeCoaches.count}
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#7f8c8d' }}>
            Active Coaches
          </p>
          {renderTrendIndicator(analytics.activeCoaches.trend)}
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaCalendarCheck
            style={{
              fontSize: '2.2rem',
              color: '#e74c3c',
              marginBottom: '15px',
            }}
          />
          <h4
            style={{
              fontSize: '1.8rem',
              marginBottom: '5px',
              color: '#2c3e50',
            }}
          >
            {analytics.sessionsBooked.count}
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#7f8c8d' }}>
            Sessions Booked
          </p>
          {renderTrendIndicator(analytics.sessionsBooked.trend)}
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaStore
            style={{
              fontSize: '2.2rem',
              color: '#e74c3c',
              marginBottom: '15px',
            }}
          />
          <h4
            style={{
              fontSize: '1.8rem',
              marginBottom: '5px',
              color: '#2c3e50',
            }}
          >
            {analytics.activeVendors?.count || 0}
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#7f8c8d' }}>
            Active Vendors
          </p>
          {renderTrendIndicator(analytics.activeVendors?.trend || 0)}
        </div>
      </div>

      {/* User Growth Chart */}
      <div
        style={{
          marginTop: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FaChartLine style={{ color: '#e74c3c' }} /> Weekly User Growth
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['week', 'month', 'quarter', 'year'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => handleTimeframeChange(timeframe)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  backgroundColor:
                    activeTimeframe === timeframe ? '#e74c3c' : '#f8f9fa',
                  color: activeTimeframe === timeframe ? 'white' : '#333',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {timeframe === 'week'
                  ? '7D'
                  : timeframe === 'month'
                  ? '30D'
                  : timeframe === 'quarter'
                  ? '90D'
                  : '1Y'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', height: '350px', width: '100%' }}>
          <canvas ref={lineChartRef}></canvas>
        </div>
      </div>

      {/* Sport Breakdown Chart */}
      <div
        style={{
          marginTop: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FaChartPie style={{ color: '#e74c3c' }} /> Activity Breakdown by
            Sport
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['week', 'month', 'quarter'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => handlePieTimeframeChange(timeframe)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  backgroundColor:
                    activePieTimeframe === timeframe ? '#e74c3c' : '#f8f9fa',
                  color: activePieTimeframe === timeframe ? 'white' : '#333',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {timeframe === 'week'
                  ? 'Weekly'
                  : timeframe === 'month'
                  ? 'Monthly'
                  : 'Quarterly'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', height: '350px', width: '100%' }}>
          <canvas ref={pieChartRef}></canvas>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div
        style={{
          marginTop: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FaTable style={{ color: '#e74c3c' }} /> Recent Sessions
          </h3>
        </div>

        {loading ? (
          <div
            style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}
          >
            Loading recent sessions...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '12px 15px',
                      textAlign: 'left',
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '12px 15px',
                      textAlign: 'left',
                    }}
                  >
                    Athlete
                  </th>
                  <th
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '12px 15px',
                      textAlign: 'left',
                    }}
                  >
                    Coach
                  </th>
                  <th
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '12px 15px',
                      textAlign: 'left',
                    }}
                  >
                    Sport
                  </th>
                  <th
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '12px 15px',
                      textAlign: 'left',
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '12px 15px',
                      textAlign: 'left',
                    }}
                  >
                    Payment Status
                  </th>
                  <th
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '12px 15px',
                      textAlign: 'left',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '12px 15px',
                      textAlign: 'left',
                    }}
                  >
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan='6'
                      style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#7f8c8d',
                      }}
                    >
                      No recent sessions found
                    </td>
                  </tr>
                ) : (
                  recentSessions.map((session, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px 15px' }}>
                        {formatDate(session.date)}
                      </td>
                      <td style={{ padding: '10px 15px' }}>
                        {session.athlete}
                      </td>
                      <td style={{ padding: '10px 15px' }}>{session.coach}</td>
                      <td style={{ padding: '10px 15px' }}>{session.sport}</td>
                      <td style={{ padding: '10px 15px' }}>
                        {session.amount
                          ? `PKR ${Number(session.amount).toLocaleString()}`
                          : '-'}
                      </td>
                      <td style={{ padding: '10px 15px' }}>
                        <span
                          style={{
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            backgroundColor:
                              session.paymentStatus === 'captured'
                                ? '#d5f4e6'
                                : session.paymentStatus === 'authorized'
                                ? '#fef9e7'
                                : session.paymentStatus === 'failed'
                                ? '#fadbd8'
                                : '#e8f4fd',
                            color:
                              session.paymentStatus === 'captured'
                                ? '#27ae60'
                                : session.paymentStatus === 'authorized'
                                ? '#f39c12'
                                : session.paymentStatus === 'failed'
                                ? '#e74c3c'
                                : '#3498db',
                          }}
                        >
                          {session.paymentStatus
                            ? session.paymentStatus.charAt(0).toUpperCase() +
                              session.paymentStatus.slice(1)
                            : '-'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 15px' }}>
                        <span
                          style={{
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            backgroundColor:
                              session.status === 'completed' ||
                              session.status === 'conducted'
                                ? '#d5f4e6'
                                : session.status === 'pending'
                                ? '#fef9e7'
                                : session.status === 'cancelled'
                                ? '#fadbd8'
                                : '#e8f4fd',
                            color:
                              session.status === 'completed' ||
                              session.status === 'conducted'
                                ? '#27ae60'
                                : session.status === 'pending'
                                ? '#f39c12'
                                : session.status === 'cancelled'
                                ? '#e74c3c'
                                : '#3498db',
                          }}
                        >
                          {session.status
                            ? session.status.charAt(0).toUpperCase() +
                              session.status.slice(1)
                            : '-'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 15px' }}>
                        {session.rating ? (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <FaStar style={{ color: '#f1c40f' }} />{' '}
                            {session.rating}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .trend-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
          font-size: 0.85rem;
          gap: 5px;
        }

        .trend-up {
          color: #27ae60;
        }

        .trend-down {
          color: #e74c3c;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminReport;
