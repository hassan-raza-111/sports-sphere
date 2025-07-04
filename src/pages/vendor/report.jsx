import React, { useEffect } from "react";
import Chart from "chart.js/auto";
import {
  FaChartPie,
  FaUserPlus,
  FaRunning,
  FaChalkboardTeacher,
  FaCalendarCheck,
  FaArrowUp,
  FaChartLine,
  FaTable,
  FaStar
} from "react-icons/fa";

const Report = () => {
  useEffect(() => {
    const lineCtx = document.getElementById("lineChart").getContext("2d");
    const pieCtx = document.getElementById("pieChart").getContext("2d");

    const lineChart = new Chart(lineCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "New Users",
            data: [320, 450, 380, 510, 620, 730],
            borderColor: "#e74c3c",
            backgroundColor: "rgba(231, 76, 60, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: "Active Users",
            data: [580, 620, 710, 680, 790, 842],
            borderColor: "#3498db",
            backgroundColor: "rgba(52, 152, 219, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top"
          },
          tooltip: {
            mode: "index",
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    const pieChart = new Chart(pieCtx, {
      type: "doughnut",
      data: {
        labels: ["Tennis", "Basketball", "Soccer", "Swimming", "Golf", "Other"],
        datasets: [
          {
            data: [28, 22, 18, 12, 10, 10],
            backgroundColor: [
              "#e74c3c",
              "#3498db",
              "#2ecc71",
              "#f1c40f",
              "#9b59b6",
              "#e67e22"
            ],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right"
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: "70%"
      }
    });

    return () => {
      lineChart.destroy();
      pieChart.destroy();
    };
  }, []);

  return (
    <div className="analytics-container">
      <h2 className="analytics-heading">
        <FaChartPie /> Platform Analytics Dashboard
      </h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <FaUserPlus />
          <h4>1,230</h4>
          <p>New Signups</p>
          <div className="trend-indicator trend-up">
            <FaArrowUp /> +12% from last month
          </div>
        </div>

        <div className="analytics-card">
          <FaRunning />
          <h4>842</h4>
          <p>Active Athletes</p>
          <div className="trend-indicator trend-up">
            <FaArrowUp /> +8% from last month
          </div>
        </div>

        <div className="analytics-card">
          <FaChalkboardTeacher />
          <h4>312</h4>
          <p>Active Coaches</p>
          <div className="trend-indicator trend-up">
            <FaArrowUp /> +5% from last month
          </div>
        </div>

        <div className="analytics-card">
          <FaCalendarCheck />
          <h4>1,582</h4>
          <p>Sessions Booked</p>
          <div className="trend-indicator trend-up">
            <FaArrowUp /> +22% from last month
          </div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h3 className="chart-title">
            <FaChartLine /> Weekly User Growth
          </h3>
        </div>
        <div className="chart-container">
          <canvas id="lineChart"></canvas>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h3 className="chart-title">
            <FaChartPie /> Activity Breakdown by Sport
          </h3>
        </div>
        <div className="chart-container">
          <canvas id="pieChart"></canvas>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h3 className="chart-title">
            <FaTable /> Recent Sessions
          </h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Athlete</th>
              <th>Coach</th>
              <th>Sport</th>
              <th>Duration</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Jun 12, 2025", "Alex Morgan", "Coach Williams", "Tennis", "90 min", "4.8"],
              ["Jun 11, 2025", "Taylor Smith", "Coach Johnson", "Basketball", "60 min", "5.0"],
              ["Jun 10, 2025", "Jamie Lee", "Coach Davis", "Soccer", "120 min", "4.5"],
              ["Jun 9, 2025", "Jordan Clark", "Coach Rodriguez", "Swimming", "45 min", "4.7"],
              ["Jun 8, 2025", "Casey Kim", "Coach Wilson", "Golf", "180 min", "4.9"]
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>
                    {j === 5 ? (
                      <>
                        <FaStar style={{ color: "#f1c40f" }} /> {cell}
                      </>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
