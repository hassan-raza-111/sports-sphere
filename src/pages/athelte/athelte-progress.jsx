import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const AthleteProgress = () => {
  const chartRef = useRef(null);
  const [performanceChart, setPerformanceChart] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState("quarter");

  const updatePerformanceChart = (timeframe) => {
    setActiveTimeframe(timeframe);

    const timeframes = {
      month: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [[78, 80, 82, 82], [77, 78, 79, 80], [75, 76, 77, 78]]
      },
      quarter: {
        labels: ["Apr", "May", "Jun"],
        data: [[75, 78, 82], [73, 77, 80], [72, 75, 78]]
      },
      half: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [[65, 68, 72, 75, 78, 82], [70, 72, 75, 73, 77, 80], [60, 65, 68, 72, 75, 78]]
      },
      year: {
        labels: ["Jul 2024", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan 2025", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [[55, 58, 60, 62, 65, 68, 65, 68, 72, 75, 78, 82], [60, 62, 65, 68, 70, 72, 70, 72, 75, 73, 77, 80], [50, 52, 55, 58, 60, 65, 60, 65, 68, 72, 75, 78]]
      }
    };

    const { labels, data } = timeframes[timeframe];

    if (performanceChart) {
      performanceChart.data.labels = labels;
      performanceChart.data.datasets[0].data = data[0];
      performanceChart.data.datasets[1].data = data[1];
      performanceChart.data.datasets[2].data = data[2];
      performanceChart.update();
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const newChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Apr", "May", "Jun"],
          datasets: [
            {
              label: "Technical Skills",
              data: [75, 78, 82],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4
            },
            {
              label: "Physical Conditioning",
              data: [73, 77, 80],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4
            },
            {
              label: "Mental Toughness",
              data: [72, 75, 78],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
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
              min: 50,
              max: 100,
              ticks: {
                callback: (value) => `${value}%`
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)"
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });

      setPerformanceChart(newChart);
    }
  }, []);

  useEffect(() => {
    updatePerformanceChart(activeTimeframe);
  }, [performanceChart]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/50 to-black/50 bg-cover bg-center text-white font-sans p-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')" }}>
      <header className="fixed top-0 left-0 w-full bg-white/90 shadow-md flex justify-between items-center px-8 py-4 z-50">
        <div className="flex items-center gap-3">
          <img src="../../assests/images/Logo.png" alt="Sport Sphere Logo" className="h-10" />
          <div className="text-xl font-bold italic text-gray-800">Sports Sphere</div>
        </div>
        <nav className="flex items-center gap-6 text-gray-800 font-semibold">
          <a href="index.html" className="hover:text-red-500 flex items-center gap-1"><i className="fas fa-home"></i> Home</a>
          <a href="athlete.html" className="hover:text-red-500 flex items-center gap-1"><i className="fas fa-user-shield"></i> Dashboard</a>
          <a href="message.html" className="hover:text-red-500 flex items-center gap-1 relative">
            <i className="fas fa-envelope"></i> Messages <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">3</span>
          </a>
          <a href="athelte-profile.html" className="hover:text-red-500"><i className="fas fa-user-tie"></i></a>
        </nav>
      </header>

      <main className="pt-32 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4 shadow-md"><i className="fas fa-chart-line"></i> Athlete Progress Analysis</h2>

        <section className="bg-white/90 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3"><i className="fas fa-chart-line text-red-500"></i> Performance Progress</h3>
          <div className="flex gap-3 mb-4">
            {['month', 'quarter', 'half', 'year'].map((t) => (
              <button
                key={t}
                className={`px-3 py-1 rounded text-sm border ${activeTimeframe === t ? 'bg-red-500 text-white border-red-500' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => updatePerformanceChart(t)}
              >
                {t === 'month' ? '1M' : t === 'quarter' ? '3M' : t === 'half' ? '6M' : '1Y'}
              </button>
            ))}
          </div>
          <div className="h-80">
            <canvas ref={chartRef}></canvas>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AthleteProgress;
