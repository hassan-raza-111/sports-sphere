import React from "react";

const paymentStyles = `
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
      url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')
        no-repeat center center/cover;
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Header styles */
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

  nav a:hover,
  nav a.active {
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

  .admin-badge {
    background-color: #e74c3c;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }

  /* Payment Management styles */
  .payment-container {
    padding: 140px 5% 60px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .payment-heading {
    font-size: 2.2rem;
    color: white;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 15px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  .payment-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  }

  .tab-btn {
    padding: 0.8rem 1.5rem;
    background-color: transparent;
    color: white;
    border: none;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;
  }

  .tab-btn.active {
    color: #e74c3c;
  }

  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #e74c3c;
  }

  .payment-content {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #e74c3c;
    overflow: hidden;
  }

  .payment-filters {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #e1e5eb;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .search-input {
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    border: 2px solid #e1e5eb;
    border-radius: 5px;
    font-size: 0.9rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%237f8c8d' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 1rem center;
  }

  .search-input:focus {
    border-color: #e74c3c;
    outline: none;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }

  .date-picker {
    padding: 0.6rem 1rem;
    border: 2px solid #e1e5eb;
    border-radius: 5px;
    font-size: 0.9rem;
  }

  .btn {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background-color: #e74c3c;
    color: white;
    border-radius: 5px;
    font-weight: 600;
    transition: background-color 0.3s, transform 0.2s;
    border: none;
    cursor: pointer;
  }

  .btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }

  .btn.secondary {
    background-color: transparent;
    border: 2px solid #e74c3c;
    color: #e74c3c;
  }

  .btn.secondary:hover {
    background-color: #e74c3c;
    color: white;
  }

  .transactions-table {
    width: 100%;
    border-collapse: collapse;
  }

  .transactions-table th,
  .transactions-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e1e5eb;
  }

  .transactions-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
  }

  .transactions-table tr:hover {
    background-color: #f8f9fa;
  }

  .status {
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .status.completed {
    background-color: #d4edda;
    color: #155724;
  }

  .status.pending {
    background-color: #fff3cd;
    color: #856404;
  }

  .status.failed {
    background-color: #f8d7da;
    color: #721c24;
  }

  .status.refunded {
    background-color: #e2e3e5;
    color: #383d41;
  }

  .pagination {
    display: flex;
    justify-content: center;
    padding: 1.5rem;
    gap: 0.5rem;
  }

  .page-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: #f8f9fa;
    cursor: pointer;
    transition: all 0.3s;
  }

  .page-btn:hover {
    background-color: #e74c3c;
    color: white;
  }

  .page-btn.active {
    background-color: #e74c3c;
    color: white;
  }

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

  /* Responsive adjustments */
  @media (max-width: 992px) {
    .transactions-table {
      display: block;
      overflow-x: auto;
    }
  }

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

    .payment-container {
      padding-top: 160px;
    }

    .payment-heading {
      font-size: 1.8rem;
    }

    .payment-filters {
      flex-direction: column;
    }

    .filter-group {
      width: 100%;
    }

    .search-input,
    .date-picker {
      width: 100%;
    }
  }

  @media (max-width: 576px) {
    .payment-tabs {
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .tab-btn {
      white-space: nowrap;
    }

    .transactions-table th,
    .transactions-table td {
      padding: 0.8rem 0.5rem;
      font-size: 0.9rem;
    }

    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
`;

const PaymentManagement = () => {
  return (
    <div>
      {/* Inject CSS dynamically */}
      <style dangerouslySetInnerHTML={{ __html: paymentStyles }} />

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
          <a href="/admin.html">
            <i className="fas fa-user-shield"></i> <span>Admin</span>{" "}
            <span className="admin-badge">ADMIN</span>
          </a>
          <a href="/payment.html" className="active">
            <i className="fas fa-money-bill-wave"></i> <span>Payments</span>
          </a>
          <a href="/report.html">
            <i className="fas fa-flag"></i> <span>Reports</span>{" "}
            <span className="notification-badge">5</span>
          </a>
        </nav>
      </header>

      <main className="payment-container">
        <h2 className="payment-heading">
          <i className="fas fa-money-bill-wave"></i> Payment Management
        </h2>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="value">$24,580</div>
            <div className="label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="value">$3,245</div>
            <div className="label">Pending Payments</div>
          </div>
          <div className="stat-card">
            <div className="value">$1,120</div>
            <div className="label">Refunded</div>
          </div>
          <div className="stat-card">
            <div className="value">1,248</div>
            <div className="label">Transactions</div>
          </div>
        </div>

        <div className="payment-tabs">
          <button className="tab-btn active">All Transactions</button>
          <button className="tab-btn">Completed</button>
          <button className="tab-btn">Pending</button>
          <button className="tab-btn">Failed</button>
          <button className="tab-btn">Refunded</button>
        </div>

        <div className="payment-content">
          <div className="payment-filters">
            <div className="filter-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search transactions..."
                style={{ width: "300px" }}
              />
              <select className="date-picker">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom range</option>
              </select>
            </div>
            <div className="filter-group">
              <button className="btn secondary">
                <i className="fas fa-download"></i> Export
              </button>
              <button className="btn">
                <i className="fas fa-filter"></i> Filter
              </button>
            </div>
          </div>

          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#TRX-78945</td>
                <td>John Smith</td>
                <td>May 15, 2025</td>
                <td>$49.99</td>
                <td>
                  <i className="fab fa-cc-visa"></i> Visa •••• 4242
                </td>
                <td>
                  <span className="status completed">Completed</span>
                </td>
                <td>
                  <button
                    className="btn secondary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Details
                  </button>
                </td>
              </tr>
              <tr>
                <td>#TRX-78944</td>
                <td>Sarah Johnson</td>
                <td>May 15, 2025</td>
                <td>$99.99</td>
                <td>
                  <i className="fab fa-cc-mastercard"></i> Mastercard •••• 5555
                </td>
                <td>
                  <span className="status completed">Completed</span>
                </td>
                <td>
                  <button
                    className="btn secondary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Details
                  </button>
                </td>
              </tr>
              <tr>
                <td>#TRX-78943</td>
                <td>Michael Brown</td>
                <td>May 14, 2025</td>
                <td>$29.99</td>
                <td>
                  <i className="fab fa-cc-mastercard"></i> Mastercard •••• 5987
                </td>
                <td>
                  <span className="status pending">Pending</span>
                </td>
                <td>
                  <button
                    className="btn secondary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Details
                  </button>
                </td>
              </tr>
              <tr>
                <td>#TRX-78942</td>
                <td>Emily Davis</td>
                <td>May 14, 2025</td>
                <td>$149.99</td>
                <td>
                  <i className="fas fa-university"></i> Bank Transfer
                </td>
                <td>
                  <span className="status completed">Completed</span>
                </td>
                <td>
                  <button
                    className="btn secondary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Details
                  </button>
                </td>
              </tr>
              <tr>
                <td>#TRX-78941</td>
                <td>Robert Wilson</td>
                <td>May 13, 2025</td>
                <td>$19.99</td>
                <td>
                  <i className="fas fa-university"></i> Bank Transfer
                </td>
                <td>
                  <span className="status failed">Failed</span>
                </td>
                <td>
                  <button
                    className="btn secondary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Details
                  </button>
                </td>
              </tr>
              <tr>
                <td>#TRX-78940</td>
                <td>Jessica Lee</td>
                <td>May 13, 2025</td>
                <td>$79.99</td>
                <td>
                  <i className="fab fa-cc-visa"></i> Visa •••• 1881
                </td>
                <td>
                  <span className="status refunded">Refunded</span>
                </td>
                <td>
                  <button
                    className="btn secondary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pagination">
            <button className="page-btn">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">
              <i className="fas fa-chevron-right"></i>
            </button>
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

export default PaymentManagement;
