import React, { useEffect, useRef, useState } from 'react';
import VendorLayout from '../../components/VendorLayout';

const BACKEND_URL = 'http://localhost:5000';

const Progress = () => {
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const lineChartRef = useRef();
  const barChartRef = useRef();

  // Get vendorId from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const vendorId = user?._id;

  useEffect(() => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    fetch(`${BACKEND_URL}/api/orders/vendor/${vendorId}/analytics`)
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        setAnalyticsLoading(false);
      })
      .catch(() => {
        setAnalyticsError('Failed to fetch analytics');
        setAnalyticsLoading(false);
      });
  }, [vendorId]);

  // Draw charts when analytics data changes
  useEffect(() => {
    if (!analytics) return;
    // Sales Over Time (Line Chart)
    if (window.Chart && lineChartRef.current) {
      if (lineChartRef.current._chartInstance) {
        lineChartRef.current._chartInstance.destroy();
      }
      const ctx = lineChartRef.current.getContext('2d');
      lineChartRef.current._chartInstance = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(analytics.salesByMonth),
          datasets: [
            {
              label: 'Sales (PKR)',
              data: Object.values(analytics.salesByMonth),
              borderColor: '#e74c3c',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#e74c3c',
              pointBorderColor: '#fff',
              pointRadius: 6,
              pointHoverRadius: 8,
              pointStyle: 'circle',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { font: { size: 16 } } },
            title: {
              display: true,
              text: 'Sales Over Time',
              font: { size: 20, weight: 'bold' },
              color: '#2c3e50',
              padding: { top: 10, bottom: 20 },
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function (context) {
                  let value = context.parsed.y;
                  return 'PKR ' + value.toLocaleString();
                },
              },
            },
          },
          scales: {
            x: {
              grid: { display: true, color: '#eee' },
              title: {
                display: true,
                text: 'Month',
                font: { size: 16 },
                color: '#2c3e50',
              },
              ticks: { font: { size: 14 } },
            },
            y: {
              beginAtZero: true,
              grid: { display: true, color: '#eee' },
              title: {
                display: true,
                text: 'Sales (PKR)',
                font: { size: 16 },
                color: '#2c3e50',
              },
              ticks: {
                font: { size: 14 },
                callback: function (value) {
                  return 'PKR ' + value.toLocaleString();
                },
              },
            },
          },
        },
      });
    }
    // Best-Selling Products (Bar Chart)
    if (window.Chart && barChartRef.current) {
      if (barChartRef.current._chartInstance) {
        barChartRef.current._chartInstance.destroy();
      }
      const ctx = barChartRef.current.getContext('2d');
      barChartRef.current._chartInstance = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(analytics.productSales),
          datasets: [
            {
              label: 'Units Sold',
              data: Object.values(analytics.productSales),
              backgroundColor: '#2980b9',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }
  }, [analytics]);

  return (
    <VendorLayout>
      <main className='analytics-container'>
        <h2 className='analytics-heading'>
          <i className='fas fa-chart-pie'></i> Vendor Analytics & Reports
        </h2>
        {analyticsLoading ? (
          <div>Loading analytics...</div>
        ) : analyticsError ? (
          <div style={{ color: 'red' }}>{analyticsError}</div>
        ) : analytics ? (
          <>
            <div className='analytics-grid'>
              <div className='analytics-card'>
                <i className='fas fa-money-bill-wave'></i>
                <h4>PKR {analytics.totalSales?.toFixed(2)}</h4>
                <p>Total Sales</p>
              </div>
              <div className='analytics-card'>
                <i className='fas fa-shopping-cart'></i>
                <h4>{analytics.totalOrders}</h4>
                <p>Total Orders</p>
              </div>
            </div>
            <div className='chart-section'>
              <div className='chart-header'>
                <h3 className='chart-title'>
                  <i className='fas fa-chart-line'></i> Sales Over Time
                </h3>
              </div>
              <div className='chart-container'>
                <canvas
                  ref={lineChartRef}
                  style={{ width: '100%', height: 250 }}
                />
              </div>
            </div>
            <div className='chart-section'>
              <div className='chart-header'>
                <h3 className='chart-title'>
                  <i className='fas fa-chart-bar'></i> Best-Selling Products
                </h3>
              </div>
              <div className='chart-container'>
                <canvas
                  ref={barChartRef}
                  style={{ width: '100%', height: 250 }}
                />
              </div>
            </div>
            <div className='chart-section'>
              <div className='chart-header'>
                <h3 className='chart-title'>
                  <i className='fas fa-download'></i> Download Reports
                </h3>
              </div>
              <a
                href={`${BACKEND_URL}/api/orders/vendor/${vendorId}/report.csv`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <button style={{ marginRight: 10 }}>Download CSV</button>
              </a>
              <a
                href={`${BACKEND_URL}/api/orders/vendor/${vendorId}/report.pdf`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <button>Download PDF</button>
              </a>
            </div>
          </>
        ) : null}
      </main>
    </VendorLayout>
  );
};

export default Progress;
