import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { API_BASE_URL } from '../../config.js';
import { FaUserShield, FaUsers, FaMoneyBillWave, FaFlag } from 'react-icons/fa';

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
          fetch(`${API_BASE_URL}/users/analytics`),
          fetch(`${API_BASE_URL}/reports/open-count`),
          fetch(`${API_BASE_URL}/orders/admin/stats`),
        ]);
        const usersData = await usersRes.json();
        const reportsData = await reportsRes.json();
        const revenueData = await revenueRes.json();
        setStats({
          activeUsers: usersData.activeUsers || 0,
          pendingApprovals: usersData.pendingApprovals || 0,
          openReports: reportsData.openCount || 0,
          revenue: revenueData.totalRevenue || 0,
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      }
    }
    fetchStats();
  }, []);

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
        <FaUserShield /> Admin Dashboard
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaUsers
            style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}
          />
          <h3
            style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              marginBottom: '1rem',
            }}
          >
            User Management
          </h3>
          <p
            style={{
              color: '#7f8c8d',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
            }}
          >
            Manage all athletes, coaches, and vendors with full administrative
            controls.
          </p>
          <Link
            to='/admin/user-management'
            style={{
              display: 'inline-block',
              padding: '0.8rem 1.5rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '5px',
              fontWeight: 600,
              transition: 'background-color 0.3s, transform 0.2s',
              textDecoration: 'none',
            }}
          >
            Manage Users
          </Link>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaMoneyBillWave
            style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}
          />
          <h3
            style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              marginBottom: '1rem',
            }}
          >
            Payment Management
          </h3>
          <p
            style={{
              color: '#7f8c8d',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
            }}
          >
            View transactions, process refunds, and manage subscription plans.
          </p>
          <Link
            to='/admin/payment-management'
            style={{
              display: 'inline-block',
              padding: '0.8rem 1.5rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '5px',
              fontWeight: 600,
              transition: 'background-color 0.3s, transform 0.2s',
              textDecoration: 'none',
            }}
          >
            Payment Center
          </Link>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <FaFlag
            style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}
          />
          <h3
            style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              marginBottom: '1rem',
            }}
          >
            Reports
          </h3>
          <p
            style={{
              color: '#7f8c8d',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
            }}
          >
            Create and manage platform-wide Reports.
          </p>
          <Link
            to='/admin/report'
            style={{
              display: 'inline-block',
              padding: '0.8rem 1.5rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '5px',
              fontWeight: 600,
              transition: 'background-color 0.3s, transform 0.2s',
              textDecoration: 'none',
            }}
          >
            View Reports
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#e74c3c',
              marginBottom: '0.5rem',
            }}
          >
            {stats.activeUsers}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Active Users
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#e74c3c',
              marginBottom: '0.5rem',
            }}
          >
            {stats.pendingApprovals}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Pending Approvals
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#e74c3c',
              marginBottom: '0.5rem',
            }}
          >
            {stats.openReports}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Open Reports
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#e74c3c',
              marginBottom: '0.5rem',
            }}
          >
            ${stats.revenue.toLocaleString()}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Revenue (30d)
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
