import React, { useEffect, useState } from 'react';
import '../../css/admin.css';
import logoImg from '../../assets/images/Logo.png';
import {
  FaHome,
  FaUserShield,
  FaFlag,
  FaUsers,
  FaMoneyBillWave,
  FaRunning,
} from 'react-icons/fa';

const Admin = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    pendingApprovals: 0,
    openReports: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, reportsRes, revenueRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/analytics'),
          fetch('http://localhost:5000/api/reports/open-count'),
          fetch('http://localhost:5000/api/order/revenue'),
        ]);
        const usersData = await usersRes.json();
        const reportsData = await reportsRes.json();
        const revenueData = await revenueRes.json();
        setStats({
          activeUsers: usersData.activeUsers || 0,
          pendingApprovals: usersData.pendingApprovals || 0,
          openReports: reportsData.openCount || 0,
          revenue: revenueData.revenue || 0,
        });
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <header>
        <a href='/' className='logo'>
          <img src={logoImg} alt='Sport Sphere Logo' className='logo-img' />
          <div>
            <div className='logo-text'>Sports Sphere</div>
          </div>
        </a>
        <nav>
          <a href='/'>
            <FaHome /> <span>Home</span>
          </a>
          <a href='/admin' className='active'>
            <FaUserShield /> <span>Admin</span>{' '}
            <span className='admin-badge'>ADMIN</span>
          </a>
          <a href='/admin/report'>
            <FaFlag /> <span>Reports</span>{' '}
            <span className='notification-badge'>5</span>
          </a>
        </nav>
      </header>

      <main className='admin-container'>
        <h2 className='admin-heading'>
          <FaUserShield /> Admin Dashboard
        </h2>

        <div className='admin-grid'>
          <div className='admin-card'>
            <FaUsers />
            <h3>User Management</h3>
            <p>
              Manage all athletes, coaches, and vendors with full administrative
              controls.
            </p>
            <a href='/admin/user-management' className='btn'>
              Manage Users
            </a>
          </div>

          <div className='admin-card'>
            <FaMoneyBillWave />
            <h3>Payment Management</h3>
            <p>
              View transactions, process refunds, and manage subscription plans.
            </p>
            <a href='/admin/payment-management' className='btn'>
              Payment Center
            </a>
          </div>

          <div className='admin-card'>
            <FaFlag />
            <h3>Reports</h3>
            <p>Create and manage platform-wide Reports.</p>
            <a href='/admin/report' className='btn'>
              View Reports
            </a>
          </div>
        </div>

        <div className='stats-overview'>
          <div className='stat-card'>
            <div className='value'>{stats.activeUsers}</div>
            <div className='label'>Active Users</div>
          </div>
          <div className='stat-card'>
            <div className='value'>{stats.pendingApprovals}</div>
            <div className='label'>Pending Approvals</div>
          </div>
          <div className='stat-card'>
            <div className='value'>{stats.openReports}</div>
            <div className='label'>Open Reports</div>
          </div>
          <div className='stat-card'>
            <div className='value'>${stats.revenue.toLocaleString()}</div>
            <div className='label'>Revenue (30d)</div>
          </div>
        </div>
      </main>

      <footer>
        <div className='footer-content'>
          <div className='footer-logo'>
            <FaRunning /> Sport Sphere
          </div>
          <div className='copyright'>
            &copy; 2025 Sport Sphere. Admin Panel v2.4.1
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
