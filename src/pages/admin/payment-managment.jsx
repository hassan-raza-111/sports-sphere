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
  const [totalItems, setTotalItems] = useState(0); // Total items for pagination
  const refundReasons = [
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'fraudulent', label: 'Fraudulent' },
    { value: 'requested_by_customer', label: 'Requested by Customer' },
  ];
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundType, setRefundType] = useState('session');
  const [refundId, setRefundId] = useState(null);
  const [selectedRefundReason, setSelectedRefundReason] = useState(
    'requested_by_customer'
  );

  useEffect(() => {
    fetchPaymentStats();
    fetchData();
  }, [activeTab, searchTerm, dateFilter, currentPage, selectedType]);

  // Force refresh when component mounts
  useEffect(() => {
    console.log('Component mounted, fetching data...');
    fetchData();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      console.log('Fetching payment stats...');

      const [orderStatsResponse, bookingStatsResponse] = await Promise.all([
        fetch('/api/orders/admin/stats'),
        fetch('/api/booking/admin/stats'),
      ]);

      if (!orderStatsResponse.ok) {
        throw new Error(`Orders stats failed: ${orderStatsResponse.status}`);
      }
      if (!bookingStatsResponse.ok) {
        throw new Error(`Booking stats failed: ${bookingStatsResponse.status}`);
      }

      const orderStats = await orderStatsResponse.json();
      const bookingStats = await bookingStatsResponse.json();

      console.log('Order stats:', orderStats);
      console.log('Booking stats:', bookingStats);

      // Calculate combined stats
      const orderRevenue = orderStats.totalRevenue || 0;
      const sessionRevenue = bookingStats.totalRevenue || 0;
      const totalRevenue = orderRevenue + sessionRevenue;

      const orderPending = orderStats.pendingPayments || 0;
      const sessionPending = bookingStats.pendingBookings || 0;
      const totalPending = orderPending + sessionPending;

      const orderRefunded = orderStats.refundedAmount || 0;
      const sessionRefunded = bookingStats.refundedAmount || 0;
      const totalRefunded = orderRefunded + sessionRefunded;

      const orderTransactions = orderStats.totalTransactions || 0;
      const sessionTransactions = bookingStats.totalBookings || 0;
      const totalTransactions = orderTransactions + sessionTransactions;

      const newStats = {
        totalRevenue,
        pendingPayments: totalPending,
        refundedAmount: totalRefunded,
        totalTransactions,
        // Keep individual stats for debugging
        orderRevenue,
        sessionRevenue,
        orderPending,
        sessionPending,
        orderRefunded,
        sessionRefunded,
        orderTransactions,
        sessionTransactions,
      };

      console.log('Combined stats:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      // Set default stats if API fails
      setStats({
        totalRevenue: 0,
        pendingPayments: 0,
        refundedAmount: 0,
        totalTransactions: 0,
        orderRevenue: 0,
        sessionRevenue: 0,
        orderPending: 0,
        sessionPending: 0,
        orderRefunded: 0,
        sessionRefunded: 0,
        orderTransactions: 0,
        sessionTransactions: 0,
      });
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
        setTotalItems(data.pagination?.totalItems || 0);
        setTotalPages(data.pagination?.totalPages || 1);
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
        console.log('Bookings data from backend:', data.bookings);
        setBookings(data.bookings || []);
        setTotalItems(data.pagination?.totalItems || 0);
        setTotalPages(data.pagination?.totalPages || 1);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const handleRefundPayment = (id, type) => {
    setRefundId(id);
    setRefundType(type);
    setSelectedRefundReason('requested_by_customer');
    setShowRefundModal(true);
  };

  const processRefund = async () => {
    if (!refundId || !selectedRefundReason) return;
    try {
      const endpoint =
        refundType === 'session'
          ? `/api/booking/admin/${refundId}/refund`
          : `/api/orders/admin/${refundId}`;
      const method = refundType === 'session' ? 'POST' : 'PUT';

      let body;
      if (refundType === 'session') {
        body = { reason: selectedRefundReason };
      } else {
        // For orders, we need to get the order details to set the refund amount
        const orderResponse = await fetch(`/api/orders/admin/${refundId}`);
        if (orderResponse.ok) {
          const order = await orderResponse.json();
          body = {
            paymentStatus: 'refunded',
            refundReason: selectedRefundReason,
            refundAmount: order.totalAmount,
          };
        } else {
          body = {
            paymentStatus: 'refunded',
            refundReason: selectedRefundReason,
          };
        }
      }
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setShowRefundModal(false);
      setRefundId(null);
      setRefundType('session');
      if (response.ok) {
        fetchData();
        alert('Payment refunded successfully!');
      } else {
        alert('Failed to refund payment');
      }
    } catch (error) {
      setShowRefundModal(false);
      setRefundId(null);
      setRefundType('session');
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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key='prev'
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '0.5rem 1rem',
          margin: '0 0.25rem',
          border: '1px solid #e1e5eb',
          backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
          color: currentPage === 1 ? '#6c757d' : '#2c3e50',
          borderRadius: '5px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        Previous
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            padding: '0.5rem 1rem',
            margin: '0 0.25rem',
            border: '1px solid #e1e5eb',
            backgroundColor: currentPage === i ? '#e74c3c' : 'white',
            color: currentPage === i ? 'white' : '#2c3e50',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key='next'
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '0.5rem 1rem',
          margin: '0 0.25rem',
          border: '1px solid #e1e5eb',
          backgroundColor: currentPage === totalPages ? '#f8f9fa' : 'white',
          color: currentPage === totalPages ? '#6c757d' : '#2c3e50',
          borderRadius: '5px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        Next
      </button>
    );

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2rem',
          gap: '1rem',
        }}
      >
        <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
          Page {currentPage} of {totalPages} ({totalItems} total items)
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>{pages}</div>
      </div>
    );
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
                      : order.paymentStatus === 'refunded'
                      ? '#e2e3e5'
                      : '#e8f4fd',
                  color:
                    order.paymentStatus === 'completed'
                      ? '#27ae60'
                      : order.paymentStatus === 'pending'
                      ? '#f39c12'
                      : order.paymentStatus === 'failed'
                      ? '#e74c3c'
                      : order.paymentStatus === 'refunded'
                      ? '#6c757d'
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
                {(order.paymentStatus === 'completed' ||
                  order.paymentStatus === 'pending') && (
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
    <div>
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
              <td
                style={{ padding: '1rem', color: '#2c3e50', fontWeight: 500 }}
              >
                #{booking._id.slice(-8)}
              </td>
              <td style={{ padding: '1rem', color: '#2c3e50' }}>
                {booking.athlete?.name || 'Unknown Athlete'}
              </td>
              <td style={{ padding: '1rem', color: '#2c3e50' }}>
                {booking.coachName || 'Unknown Coach'}
              </td>
              <td
                style={{ padding: '1rem', color: '#2c3e50', fontWeight: 600 }}
              >
                {formatCurrency(booking.amount)}
              </td>
              <td style={{ padding: '1rem', color: '#7f8c8d' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
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
                        : booking.paymentStatus === 'refunded'
                        ? '#e2e3e5'
                        : '#e8f4fd',
                    color:
                      booking.paymentStatus === 'captured'
                        ? '#27ae60'
                        : booking.paymentStatus === 'authorized'
                        ? '#f39c12'
                        : booking.paymentStatus === 'failed'
                        ? '#e74c3c'
                        : booking.paymentStatus === 'refunded'
                        ? '#6c757d'
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
                      onClick={() =>
                        handleCapturePayment(booking._id, 'session')
                      }
                    >
                      <FaCheck />
                    </button>
                  )}
                  {(booking.paymentStatus === 'captured' ||
                    booking.paymentStatus === 'authorized') && (
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
                      onClick={() =>
                        handleRefundPayment(booking._id, 'session')
                      }
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

      {/* Pagination for sessions */}
      {renderPagination()}
    </div>
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
          <div
            style={{
              color: '#95a5a6',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
            }}
          >
            Orders: {formatCurrency(stats.orderRevenue)} | Sessions:{' '}
            {formatCurrency(stats.sessionRevenue)}
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
          <div
            style={{
              color: '#95a5a6',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
            }}
          >
            Orders: {formatCurrency(stats.orderPending)} | Sessions:{' '}
            {formatCurrency(stats.sessionPending)}
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
          <div
            style={{
              color: '#95a5a6',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
            }}
          >
            Orders: {formatCurrency(stats.orderRefunded)} | Sessions:{' '}
            {formatCurrency(stats.sessionRefunded)}
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
          <div
            style={{
              color: '#95a5a6',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
            }}
          >
            Orders: {stats.orderTransactions} | Sessions:{' '}
            {stats.sessionTransactions}
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #27ae60',
          }}
        >
          <div
            style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#27ae60',
              marginBottom: '0.5rem',
            }}
          >
            {formatCurrency(stats.orderRevenue)}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Product Orders Revenue
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #3498db',
          }}
        >
          <div
            style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#3498db',
              marginBottom: '0.5rem',
            }}
          >
            {formatCurrency(stats.sessionRevenue)}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Session Bookings Revenue
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
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
      {showRefundModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: 32,
              borderRadius: 8,
              minWidth: 320,
            }}
          >
            <h3 style={{ marginBottom: 16 }}>Select Refund Reason</h3>
            <select
              value={selectedRefundReason}
              onChange={(e) => setSelectedRefundReason(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 24 }}
            >
              {refundReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}
            >
              <button
                onClick={() => setShowRefundModal(false)}
                style={{
                  padding: '0.5rem 1.2rem',
                  background: '#ccc',
                  border: 'none',
                  borderRadius: 4,
                }}
              >
                Cancel
              </button>
              <button
                onClick={processRefund}
                style={{
                  padding: '0.5rem 1.2rem',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                }}
              >
                Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminPaymentManagement;
