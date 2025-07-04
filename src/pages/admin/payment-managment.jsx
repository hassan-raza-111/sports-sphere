import React, { useEffect, useState } from 'react';
import logoImg from '../../assets/images/Logo.png';
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
  /* Main styles */
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
  @media(max-width:768px){
    .transactions-table {
      display: block;
      overflow-x: auto;
    }
  }
`;

const PaymentManagement = () => {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('http://localhost:5000/api/order');
        const data = await res.json();
        setOrders(data);
      } catch (err) {}
    }
    fetchOrders();
  }, []);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (tab !== 'all' && order.status !== tab) return false;
    if (
      search &&
      !(
        order.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        order.email?.toLowerCase().includes(search.toLowerCase()) ||
        order.transactionId?.toLowerCase().includes(search.toLowerCase())
      )
    )
      return false;
    // Date filter (simple: last 7, 30, 90 days)
    if (dateRange !== 'all') {
      const days = parseInt(dateRange);
      const orderDate = new Date(order.createdAt);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (orderDate < cutoff) return false;
    }
    return true;
  });

  // Stats
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const pendingPayments = orders
    .filter((o) => o.status === 'pending')
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const refunded = orders
    .filter((o) => o.status === 'refunded')
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const transactions = orders.length;

  return (
    <div>
      {/* Inject styles */}
      <style dangerouslySetInnerHTML={{ __html: paymentStyles }} />

      {/* Header */}
      <header>
        <a href='/index.html' className='logo'>
          <img src={logoImg} alt='Sport Sphere Logo' className='logo-img' />
          <div>
            <div className='logo-text'>Sports Sphere</div>
          </div>
        </a>
        <nav>
          <a href='/index.html'>
            <i className='fas fa-home'></i> <span>Home</span>
          </a>
          <a href='/admin.html'>
            <i className='fas fa-user-shield'></i> <span>Admin</span>{' '}
            <span className='admin-badge'>ADMIN</span>
          </a>
          <a href='/payment.html' className='active'>
            <i className='fas fa-money-bill-wave'></i> <span>Payments</span>
          </a>
          <a href='/report.html'>
            <i className='fas fa-flag'></i> <span>Reports</span>{' '}
            <span className='notification-badge'>5</span>
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className='payment-container'>
        <h2 className='payment-heading'>
          <i className='fas fa-money-bill-wave'></i> Payment Management
        </h2>

        {/* Stats Overview */}
        <div className='stats-overview'>
          <div className='stat-card'>
            <div className='value'>${totalRevenue.toLocaleString()}</div>
            <div className='label'>Total Revenue</div>
          </div>
          <div className='stat-card'>
            <div className='value'>${pendingPayments.toLocaleString()}</div>
            <div className='label'>Pending Payments</div>
          </div>
          <div className='stat-card'>
            <div className='value'>${refunded.toLocaleString()}</div>
            <div className='label'>Refunded</div>
          </div>
          <div className='stat-card'>
            <div className='value'>{transactions}</div>
            <div className='label'>Transactions</div>
          </div>
        </div>

        {/* Tabs */}
        <div className='payment-tabs'>
          <button
            className={`tab-btn${tab === 'all' ? ' active' : ''}`}
            onClick={() => setTab('all')}
          >
            All Transactions
          </button>
          <button
            className={`tab-btn${tab === 'completed' ? ' active' : ''}`}
            onClick={() => setTab('completed')}
          >
            Completed
          </button>
          <button
            className={`tab-btn${tab === 'pending' ? ' active' : ''}`}
            onClick={() => setTab('pending')}
          >
            Pending
          </button>
          <button
            className={`tab-btn${tab === 'failed' ? ' active' : ''}`}
            onClick={() => setTab('failed')}
          >
            Failed
          </button>
          <button
            className={`tab-btn${tab === 'refunded' ? ' active' : ''}`}
            onClick={() => setTab('refunded')}
          >
            Refunded
          </button>
        </div>

        {/* Payment Content */}
        <div className='payment-content'>
          {/* Filters */}
          <div className='payment-filters'>
            <div className='filter-group'>
              <input
                type='text'
                className='search-input'
                placeholder='Search transactions...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className='date-picker'
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value='7'>Last 7 days</option>
                <option value='30'>Last 30 days</option>
                <option value='90'>Last 90 days</option>
                <option value='all'>All time</option>
              </select>
            </div>
            <div className='filter-group'>
              <button className='btn secondary'>
                <i className='fas fa-download'></i> Export
              </button>
              <button className='btn'>
                <i className='fas fa-filter'></i> Filter
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <table className='transactions-table'>
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
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.transactionId || order._id}</td>
                  <td>
                    {order.fullName} <br />
                    <span style={{ fontSize: '0.85em', color: '#888' }}>
                      {order.email}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.amount?.toFixed(2) || '0.00'}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      className='btn secondary'
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan='7'
                    style={{ textAlign: 'center', color: '#888' }}
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className='pagination'>
            <button className='page-btn'>
              <i className='fas fa-chevron-left'></i>
            </button>
            <button className='page-btn active'>1</button>
            <button className='page-btn'>2</button>
            <button className='page-btn'>3</button>
            <button className='page-btn'>4</button>
            <button className='page-btn'>
              <i className='fas fa-chevron-right'></i>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className='footer-content'>
          <div className='footer-logo'>
            <i className='fas fa-running'></i> Sport Sphere
          </div>
          <div className='copyright'>
            © 2025 Sport Sphere. Admin Panel v2.4.1
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentManagement;
