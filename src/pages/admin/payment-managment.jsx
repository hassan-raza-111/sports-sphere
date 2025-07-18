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
  FaCheck,
  FaTimes,
  FaCalendar,
  FaUser,
} from 'react-icons/fa';

function AdminPaymentManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    refundedAmount: 0,
    totalTransactions: 0,
    sessionRevenue: 0,
    pendingSessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('7');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'orders', 'sessions'
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchPaymentStats();
    fetchData();
  }, [activeTab, searchTerm, dateFilter, currentPage, selectedType]);

  const fetchPaymentStats = async () => {
    try {
      const [orderStats, bookingStats] = await Promise.all([
        fetch('/api/orders/admin/stats').then((r) => r.json()),
        fetch('/api/booking/admin/stats').then((r) => r.json()),
      ]);

      setStats({
        ...orderStats,
        sessionRevenue: bookingStats.totalRevenue || 0,
        pendingSessions: bookingStats.pendingBookings || 0,
        totalRevenue:
          (orderStats.totalRevenue || 0) + (bookingStats.totalRevenue || 0),
        totalTransactions:
          (orderStats.totalTransactions || 0) +
          (bookingStats.totalBookings || 0),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      if (selectedType === 'all' || selectedType === 'orders') {
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
        setOrders(data.orders || []);
      }

      if (selectedType === 'all' || selectedType === 'sessions') {
        const params = new URLSearchParams({
          page: currentPage,
          limit: 10,
          search: searchTerm,
        });

        if (activeTab !== 'all') {
          params.append('paymentStatus', activeTab);
        }

        const response = await fetch(`/api/booking/admin?${params}`);
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
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

  const handleCapturePayment = async (id, type) => {
    try {
      const endpoint =
        type === 'session'
          ? `/api/booking/admin/${id}/capture`
          : `/api/orders/admin/${id}`;
      const method = type === 'session' ? 'POST' : 'PUT';
      const body = type === 'session' ? {} : { paymentStatus: 'completed' };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'PUT' ? JSON.stringify(body) : undefined,
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert('Payment captured successfully!');
      } else {
        alert('Failed to capture payment');
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
      alert('Error capturing payment');
    }
  };

  const handleRefundPayment = async (id, type) => {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    try {
      const endpoint =
        type === 'session'
          ? `/api/booking/admin/${id}/refund`
          : `/api/orders/admin/${id}`;
      const method = type === 'session' ? 'POST' : 'PUT';
      const body =
        type === 'session'
          ? { reason }
          : { paymentStatus: 'refunded', refundReason: reason };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert('Payment refunded successfully!');
      } else {
        alert('Failed to refund payment');
      }
    } catch (error) {
      console.error('Error refunding payment:', error);
      alert('Error refunding payment');
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
      case 'captured':
        return 'completed';
      case 'pending':
      case 'authorized':
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
      currency: 'PKR',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Modal open/close handlers
  const handleViewDetails = (data) => {
    setModalData(data);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const renderOrdersTable = () => (
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
        {orders.map((order) => (
          <tr key={order._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '1rem', color: '#2c3e50', fontWeight: 500 }}>
              #{order._id.slice(-8)}
            </td>
            <td style={{ padding: '1rem', color: '#2c3e50' }}>
              {order.userId?.name || 'Unknown User'}
            </td>
            <td style={{ padding: '1rem', color: '#2c3e50', fontWeight: 600 }}>
              {formatCurrency(order.totalAmount)}
            </td>
            <td style={{ padding: '1rem', color: '#2c3e50' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                  onClick={() => handleViewDetails(order)}
                >
                  <FaEye />
                </button>
                {order.paymentStatus === 'pending' && (
                  <button
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    title='Capture Payment'
                    onClick={() => handleCapturePayment(order._id, 'order')}
                  >
                    <FaCheck />
                  </button>
                )}
                {order.paymentStatus !== 'refunded' && (
                  <button
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    title='Refund Payment'
                    onClick={() => handleRefundPayment(order._id, 'order')}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderSessionsTable = () => (
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
            Session ID
          </th>
          <th
            style={{
              padding: '1rem',
              textAlign: 'left',
              fontWeight: 600,
              color: '#2c3e50',
            }}
          >
            Athlete
          </th>
          <th
            style={{
              padding: '1rem',
              textAlign: 'left',
              fontWeight: 600,
              color: '#2c3e50',
            }}
          >
            Coach
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
            Date & Time
          </th>
          <th
            style={{
              padding: '1rem',
              textAlign: 'left',
              fontWeight: 600,
              color: '#2c3e50',
            }}
          >
            Payment Status
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
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '1rem', color: '#2c3e50', fontWeight: 500 }}>
              #{booking._id.slice(-8)}
            </td>
            <td style={{ padding: '1rem', color: '#2c3e50' }}>
              {booking.athlete?.name || 'Unknown Athlete'}
            </td>
            <td style={{ padding: '1rem', color: '#2c3e50' }}>
              {booking.coach?.userId?.name ||
                booking.coach?.name ||
                'Unknown Coach'}
            </td>
            <td style={{ padding: '1rem', color: '#2c3e50', fontWeight: 600 }}>
              {formatCurrency(booking.amount)}
            </td>
            <td style={{ padding: '1rem', color: '#7f8c8d' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <FaCalendar />
                {formatDate(booking.date)} at {booking.time}
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
                    booking.paymentStatus === 'captured'
                      ? '#d5f4e6'
                      : booking.paymentStatus === 'authorized'
                      ? '#fef9e7'
                      : booking.paymentStatus === 'failed'
                      ? '#fadbd8'
                      : '#e8f4fd',
                  color:
                    booking.paymentStatus === 'captured'
                      ? '#27ae60'
                      : booking.paymentStatus === 'authorized'
                      ? '#f39c12'
                      : booking.paymentStatus === 'failed'
                      ? '#e74c3c'
                      : '#3498db',
                }}
              >
                {booking.paymentStatus.charAt(0).toUpperCase() +
                  booking.paymentStatus.slice(1)}
              </span>
            </td>
            <td style={{ padding: '1rem' }}>
              <span
                style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor:
                    booking.status === 'completed' ||
                    booking.status === 'conducted'
                      ? '#d5f4e6'
                      : booking.status === 'pending'
                      ? '#fef9e7'
                      : booking.status === 'cancelled'
                      ? '#fadbd8'
                      : '#e8f4fd',
                  color:
                    booking.status === 'completed' ||
                    booking.status === 'conducted'
                      ? '#27ae60'
                      : booking.status === 'pending'
                      ? '#f39c12'
                      : booking.status === 'cancelled'
                      ? '#e74c3c'
                      : '#3498db',
                }}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </td>
            <td style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                  onClick={() => handleViewDetails(booking)}
                >
                  <FaEye />
                </button>
                {booking.paymentStatus === 'authorized' && (
                  <button
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    title='Capture Payment'
                    onClick={() => handleCapturePayment(booking._id, 'session')}
                  >
                    <FaCheck />
                  </button>
                )}
                {booking.paymentStatus !== 'refunded' && (
                  <button
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    title='Refund Payment'
                    onClick={() => handleRefundPayment(booking._id, 'session')}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

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
            {stats.pendingPayments + stats.pendingSessions}
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
        {/* Type Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '2px solid #ecf0f1',
          }}
        >
          {[
            { key: 'all', label: 'All Transactions' },
            { key: 'orders', label: 'Product Orders' },
            { key: 'sessions', label: 'Session Bookings' },
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => handleTypeChange(type.key)}
              style={{
                padding: '0.8rem 1.5rem',
                border: 'none',
                background: 'none',
                color: selectedType === type.key ? '#e74c3c' : '#7f8c8d',
                fontWeight: selectedType === type.key ? 600 : 400,
                borderBottom:
                  selectedType === type.key
                    ? '3px solid #e74c3c'
                    : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '2px solid #ecf0f1',
          }}
        >
          {[
            { key: 'all', label: 'All Status' },
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
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <FaSearch
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7f8c8d',
                }}
              />
              <input
                type='text'
                placeholder='Search transactions...'
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  padding: '0.8rem 1rem 0.8rem 2.5rem',
                  border: '2px solid #e1e5eb',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  width: '300px',
                }}
              />
            </div>
            <select
              value={dateFilter}
              onChange={handleDateFilterChange}
              style={{
                padding: '0.8rem 1rem',
                border: '2px solid #e1e5eb',
                borderRadius: '5px',
                fontSize: '1rem',
              }}
            >
              <option value='7'>Last 7 days</option>
              <option value='30'>Last 30 days</option>
              <option value='90'>Last 90 days</option>
              <option value='all'>All time</option>
            </select>
          </div>
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

        {/* Transactions Table */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#7f8c8d',
              }}
            >
              Loading transactions...
            </div>
          ) : selectedType === 'sessions' ? (
            renderSessionsTable()
          ) : selectedType === 'orders' ? (
            renderOrdersTable()
          ) : (
            <>
              {bookings.length > 0 && (
                <>
                  <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
                    Session Bookings
                  </h3>
                  {renderSessionsTable()}
                </>
              )}
              {orders.length > 0 && (
                <>
                  <h3
                    style={{
                      marginBottom: '1rem',
                      color: '#2c3e50',
                      marginTop: '2rem',
                    }}
                  >
                    Product Orders
                  </h3>
                  {renderOrdersTable()}
                </>
              )}
              {bookings.length === 0 && orders.length === 0 && (
                <div
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#7f8c8d',
                  }}
                >
                  No transactions found
                </div>
              )}
            </>
          )}
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
                border: '1px solid #e1e5eb',
                backgroundColor: 'white',
                borderRadius: '5px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                color: currentPage === 1 ? '#bdc3c7' : '#2c3e50',
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
                border: '1px solid #e1e5eb',
                backgroundColor: 'white',
                borderRadius: '5px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                color: currentPage === totalPages ? '#bdc3c7' : '#2c3e50',
              }}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Modal for details */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '10px',
              padding: '2rem',
              minWidth: 350,
              maxWidth: 500,
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 22,
                color: '#e74c3c',
                cursor: 'pointer',
              }}
              title='Close'
            >
              <FaTimes />
            </button>
            <h3 style={{ marginBottom: 16, color: '#2c3e50' }}>
              Payment Details
            </h3>
            {modalData && (
              <div style={{ color: '#2c3e50', fontSize: 16 }}>
                <div>
                  <b>ID:</b> {modalData._id}
                </div>
                {modalData.userId && (
                  <div>
                    <b>User:</b>{' '}
                    {modalData.userId.name || modalData.userId.email || 'N/A'}
                  </div>
                )}
                {modalData.athlete && (
                  <div>
                    <b>Athlete:</b> {modalData.athlete.name}
                  </div>
                )}
                {modalData.coach && (
                  <div>
                    <b>Coach:</b> {modalData.coach.name}
                  </div>
                )}
                <div>
                  <b>Amount:</b>{' '}
                  {formatCurrency(modalData.totalAmount || modalData.amount)}
                </div>
                <div>
                  <b>Status:</b> {modalData.paymentStatus || modalData.status}
                </div>
                <div>
                  <b>Date:</b>{' '}
                  {formatDate(modalData.createdAt || modalData.date)}
                </div>
                {modalData.paymentMethod && (
                  <div>
                    <b>Payment Method:</b>{' '}
                    {getPaymentMethodText
                      ? getPaymentMethodText(modalData.paymentMethod)
                      : modalData.paymentMethod}
                  </div>
                )}
                {modalData.refundReason && (
                  <div>
                    <b>Refund Reason:</b> {modalData.refundReason}
                  </div>
                )}
                {/* Add more fields as needed */}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminPaymentManagement;
