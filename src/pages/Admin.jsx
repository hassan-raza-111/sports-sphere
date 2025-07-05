import React from "react";

const adminStyles = `
  /* Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
  }

  body {
    color: #333;
    line-height: 1.6;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Header styles - matching previous pages */
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 5%;
    background-color: rgba(255, 255, 255, 0.95);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-img {
    height: 40px;
    width: auto;
  }

  .logo-text {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;   
    font-style: italic;
  }

  .logo-tagline {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-top: 3px;
  }

  nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  nav a {
    font-weight: 600;
    color: #2c3e50;
    transition: color 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  nav a:hover, nav a.active {
    color: #e74c3c;
  }

  .notification-badge {
    background-color: #e74c3c;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
  }

  .profile-btn {
    background-color: #e74c3c;
    color: white !important;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
  }

  .profile-btn:hover {
    background-color: #c0392b;
  }

  /* Admin Dashboard styles */
  .admin-container {
    padding: 140px 5% 60px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .admin-heading {
    font-size: 2.2rem;
    color: white;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 15px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  /* Card grid */
  .admin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .admin-card {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    border-left: 4px solid #e74c3c;
    text-align: center;
  }

  .admin-card:hover {
    transform: translateY(-5px);
  }

  .admin-card i {
    font-size: 2rem;
    color: #e74c3c;
    margin-bottom: 1rem;
    background-color: #f9e9e8;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }

  .admin-card:hover i {
    background-color: #e74c3c;
    color: white;
  }

  .admin-card h3 {
    font-size: 1.3rem;
    color: #2c3e50;
    margin-bottom: 0.8rem;
  }

  .admin-card p {
    color: #7f8c8d;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .btn {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background-color: #e74c3c;
    color: white;
    border-radius: 5px;
    font-weight: 600;
    transition: background-color 0.3s, transform 0.2s;
    text-decoration: none;
  }

  .btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }

  /* Stats overview */
  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .stat-card {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #e74c3c;
  }

  .stat-card .value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #e74c3c;
    margin-bottom: 0.5rem;
  }

  .stat-card .label {
    color: #7f8c8d;
    font-size: 0.9rem;
  }

  /* Footer styles */
  footer {
    background-color: rgba(44, 62, 80, 0.9);
    color: white;
    padding: 2rem 5%;
    margin-top: 3rem;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-logo {
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .copyright {
    font-size: 0.9rem;
  }

  .admin-badge {
    background-color: #e74c3c;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    header {
      padding: 1rem 5%;
      flex-direction: column;
      gap: 1rem;
    }

    nav {
      width: 100%;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .admin-container {
      padding-top: 160px;
    }

    .admin-heading {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 576px) {
    .admin-grid {
      grid-template-columns: 1fr;
    }

    .stats-overview {
      grid-template-columns: 1fr 1fr;
    }

    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
`;

const AdminDashboard = () => {
  return (
    <div>
      {/* Inject CSS dynamically */}
      <style dangerouslySetInnerHTML={{ __html: adminStyles }} />

      <header>
        <a href="/index.html" className="logo">
          <img
            src="/assets/images/Logo.png"
            alt="Sport Sphere Logo"
            className="logo-img"
          />
          <div>
            <div className="logo-text">Sports Sphere</div>
          </div>
        </a>
        <nav>
          <a href="/index.html">
            <i className="fas fa-home"></i> <span>Home</span>
          </a>
          <a href="/admin.html" className="active">
            <i className="fas fa-user-shield"></i> <span>Admin</span>{" "}
            <span className="admin-badge">ADMIN</span>
          </a>
          <a href="/report.html">
            <i className="fas fa-flag"></i> <span>Reports</span>{" "}
            <span className="notification-badge">5</span>
          </a>
        </nav>
      </header>

      <main className="admin-container">
        <h2 className="admin-heading">
          <i className="fas fa-user-shield"></i> Admin Dashboard
        </h2>

        <div className="admin-grid">
          <div className="admin-card">
            <i className="fas fa-users"></i>
            <h3>User Management</h3>
            <p>
              Manage all athletes, coaches, and vendors with full administrative
              controls.
            </p>
            <a href="/admin/user-management" className="btn">
              Manage Users
            </a>
          </div>

          <div className="admin-card">
            <i className="fas fa-money-bill-wave"></i>
            <h3>Payment Management</h3>
            <p>
              View transactions, process refunds, and manage subscription plans.
            </p>
            <a href="/admin/payments" className="btn">
              Payment Center
            </a>
          </div>

          <div className="admin-card">
            <i className="fas fa-flag"></i>
            <h3>Reports</h3>
            <p>Create and manage platform-wide Reports.</p>
            <a href="/admin/reports" className="btn">
              View Reports
            </a>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="value">1,248</div>
            <div className="label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="value">87</div>
            <div className="label">Pending Approvals</div>
          </div>
          <div className="stat-card">
            <div className="value">23</div>
            <div className="label">Open Reports</div>
          </div>
          <div className="stat-card">
            <div className="value">$12,847</div>
            <div className="label">Revenue (30d)</div>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-running"></i> Sport Sphere
          </div>
          <div className="copyright">
            &copy; 2025 Sport Sphere. Admin Panel v2.4.1
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
