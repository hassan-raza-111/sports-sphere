import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  FaMoneyBillWave,
  FaSearch,
  FaDownload,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaCreditCard,
  FaUniversity,
  FaEye,
} from 'react-icons/fa';

function AdminPaymentManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    refundedAmount: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('7');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPaymentStats();
    fetchOrders();
  }, [activeTab, searchTerm, dateFilter, currentPage]);

  const fetchPaymentStats = async () => {
    try {
      const response = await fetch('/api/orders/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchTerm,
      });

      if (activeTab !== 'all') {
        params.append('paymentStatus', activeTab);
      }

      const response = await fetch(`/api/orders/admin?${params}`);
      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/orders/admin/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders-export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting orders:', error);
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <FaCreditCard />;
      case 'bank_transfer':
        return <FaUniversity />;
      default:
        return <FaCreditCard />;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'debit_card':
        return 'Debit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'failed':
        return 'failed';
      case 'refunded':
        return 'refunded';
      default:
        return '';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <FaMoneyBillWave /> Payment Management
      </h2>

      {/* Stats Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
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
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Total Revenue
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
            {stats.pendingPayments}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Pending Payments
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
            {formatCurrency(stats.refundedAmount)}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Refunded Amount
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
            {stats.totalTransactions}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Total Transactions
          </div>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '10px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '2px solid #ecf0f1',
          }}
        >
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'completed', label: 'Completed' },
            { key: 'pending', label: 'Pending' },
            { key: 'failed', label: 'Failed' },
            { key: 'refunded', label: 'Refunded' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              style={{
                padding: '0.8rem 1.5rem',
                border: 'none',
                background: 'none',
                color: activeTab === tab.key ? '#e74c3c' : '#7f8c8d',
                fontWeight: activeTab === tab.key ? 600 : 400,
                borderBottom:
                  activeTab === tab.key
                    ? '3px solid #e74c3c'
                    : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ position: 'relative' }}>
              <FaSearch
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7f8c8d',
                }}
              />
              <input
                type='text'
                placeholder='Search orders...'
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>
          <select
            value={dateFilter}
            onChange={handleDateFilterChange}
            style={{
              padding: '0.8rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1rem',
              minWidth: '150px',
            }}
          >
            <option value='7'>Last 7 days</option>
            <option value='30'>Last 30 days</option>
            <option value='90'>Last 90 days</option>
            <option value='365'>Last year</option>
          </select>
          <button
            onClick={handleExport}
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600,
            }}
          >
            <FaDownload /> Export CSV
          </button>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2c3e50',
                  }}
                >
                  Order ID
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2c3e50',
                  }}
                >
                  Customer
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2c3e50',
                  }}
                >
                  Amount
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2c3e50',
                  }}
                >
                  Payment Method
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2c3e50',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2c3e50',
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2c3e50',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan='7'
                    style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: '#7f8c8d',
                    }}
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan='7'
                    style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: '#7f8c8d',
                    }}
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    style={{ borderBottom: '1px solid #ecf0f1' }}
                  >
                    <td
                      style={{
                        padding: '1rem',
                        color: '#2c3e50',
                        fontWeight: 500,
                      }}
                    >
                      #{order._id.slice(-8)}
                    </td>
                    <td style={{ padding: '1rem', color: '#2c3e50' }}>
                      {order.userId?.name || 'Unknown User'}
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        color: '#2c3e50',
                        fontWeight: 600,
                      }}
                    >
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td style={{ padding: '1rem', color: '#2c3e50' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        {getPaymentMethodIcon(order.paymentMethod)}
                        {getPaymentMethodText(order.paymentMethod)}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor:
                            order.paymentStatus === 'completed'
                              ? '#d5f4e6'
                              : order.paymentStatus === 'pending'
                              ? '#fef9e7'
                              : order.paymentStatus === 'failed'
                              ? '#fadbd8'
                              : '#e8f4fd',
                          color:
                            order.paymentStatus === 'completed'
                              ? '#27ae60'
                              : order.paymentStatus === 'pending'
                              ? '#f39c12'
                              : order.paymentStatus === 'failed'
                              ? '#e74c3c'
                              : '#3498db',
                        }}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#7f8c8d' }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                        title='View Details'
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2rem',
            }}
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
                color: currentPage === 1 ? '#6c757d' : '#2c3e50',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                borderRadius: '5px',
              }}
            >
              <FaChevronLeft />
            </button>
            <span style={{ color: '#2c3e50' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                backgroundColor:
                  currentPage === totalPages ? '#f8f9fa' : 'white',
                color: currentPage === totalPages ? '#6c757d' : '#2c3e50',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                borderRadius: '5px',
              }}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPaymentManagement;
