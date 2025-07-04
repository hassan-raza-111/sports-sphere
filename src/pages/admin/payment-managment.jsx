import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMoneyBillWave,
  FaSearch,
  FaDownload,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaUserShield,
  FaFlag,
  FaRunning,
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
      const response = await fetch('/api/order/admin/stats');
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

      const response = await fetch(`/api/order/admin?${params}`);
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
      const response = await fetch('/api/order/admin/export');
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
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80") no-repeat center center/cover',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 5%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Link
          to='/'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <img
            src='/src/assets/images/Logo.png'
            alt='Sport Sphere Logo'
            style={{ height: '40px', width: 'auto' }}
          />
          <div>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#2c3e50',
                fontStyle: 'italic',
              }}
            >
              Sports Sphere
            </div>
          </div>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link
            to='/'
            style={{
              fontWeight: 600,
              color: '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaHome /> <span>Home</span>
          </Link>
          <Link
            to='/admin/dashboard'
            style={{
              fontWeight: 600,
              color: '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaUserShield /> <span>Admin</span>
            <span
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                marginLeft: '0.5rem',
              }}
            >
              ADMIN
            </span>
          </Link>
          <Link
            to='/admin/payment-management'
            style={{
              fontWeight: 600,
              color: '#e74c3c',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaMoneyBillWave /> <span>Payments</span>
          </Link>
          <Link
            to='/admin/report'
            style={{
              fontWeight: 600,
              color: '#2c3e50',
              transition: 'color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <FaFlag /> <span>Reports</span>
            <span
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '5px',
              }}
            >
              5
            </span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main
        style={{
          padding: '140px 5% 60px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
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
              {formatCurrency(stats.pendingPayments)}
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
            <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Refunded</div>
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
              Transactions
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {[
            { key: 'all', label: 'All Transactions' },
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
                backgroundColor: 'transparent',
                color: activeTab === tab.key ? '#e74c3c' : 'white',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s',
              }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: '#e74c3c',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Payment Content */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c',
            overflow: 'hidden',
          }}
        >
          {/* Filters */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1.5rem',
              borderBottom: '1px solid #e1e5eb',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type='text'
                placeholder='Search transactions...'
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  padding: '0.6rem 1rem 0.6rem 2.5rem',
                  border: '2px solid #e1e5eb',
                  borderRadius: '5px',
                  fontSize: '0.9rem',
                  width: '300px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%237f8c8d' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '1rem center',
                }}
              />
              <select
                value={dateFilter}
                onChange={handleDateFilterChange}
                style={{
                  padding: '0.6rem 1rem',
                  border: '2px solid #e1e5eb',
                  borderRadius: '5px',
                  fontSize: '0.9rem',
                }}
              >
                <option value='7'>Last 7 days</option>
                <option value='30'>Last 30 days</option>
                <option value='90'>Last 90 days</option>
                <option value='custom'>Custom range</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={handleExport}
                style={{
                  display: 'inline-block',
                  padding: '0.6rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: '2px solid #e74c3c',
                  color: '#e74c3c',
                  borderRadius: '5px',
                  fontWeight: 600,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
              >
                <FaDownload /> Export
              </button>
              <button
                style={{
                  display: 'inline-block',
                  padding: '0.6rem 1.5rem',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  borderRadius: '5px',
                  fontWeight: 600,
                  transition: 'background-color 0.3s, transform 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FaFilter /> Filter
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          {loading ? (
            <div
              style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}
            >
              Loading transactions...
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        borderBottom: '1px solid #e1e5eb',
                        backgroundColor: '#f8f9fa',
                        fontWeight: 600,
                        color: '#2c3e50',
                      }}
                    >
                      Transaction ID
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        borderBottom: '1px solid #e1e5eb',
                        backgroundColor: '#f8f9fa',
                        fontWeight: 600,
                        color: '#2c3e50',
                      }}
                    >
                      User
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        borderBottom: '1px solid #e1e5eb',
                        backgroundColor: '#f8f9fa',
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
                        borderBottom: '1px solid #e1e5eb',
                        backgroundColor: '#f8f9fa',
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
                        borderBottom: '1px solid #e1e5eb',
                        backgroundColor: '#f8f9fa',
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
                        borderBottom: '1px solid #e1e5eb',
                        backgroundColor: '#f8f9fa',
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
                        borderBottom: '1px solid #e1e5eb',
                        backgroundColor: '#f8f9fa',
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
                    <tr
                      key={order._id}
                      style={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                    >
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid #e1e5eb',
                        }}
                      >
                        {order.transactionId}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid #e1e5eb',
                        }}
                      >
                        {order.userId?.name || 'N/A'}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid #e1e5eb',
                        }}
                      >
                        {formatDate(order.createdAt)}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid #e1e5eb',
                        }}
                      >
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid #e1e5eb',
                        }}
                      >
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
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid #e1e5eb',
                        }}
                      >
                        <span
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            backgroundColor:
                              getStatusClass(order.paymentStatus) ===
                              'completed'
                                ? '#d4edda'
                                : getStatusClass(order.paymentStatus) ===
                                  'pending'
                                ? '#fff3cd'
                                : getStatusClass(order.paymentStatus) ===
                                  'failed'
                                ? '#f8d7da'
                                : '#e2e3e5',
                            color:
                              getStatusClass(order.paymentStatus) ===
                              'completed'
                                ? '#155724'
                                : getStatusClass(order.paymentStatus) ===
                                  'pending'
                                ? '#856404'
                                : getStatusClass(order.paymentStatus) ===
                                  'failed'
                                ? '#721c24'
                                : '#383d41',
                          }}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid #e1e5eb',
                        }}
                      >
                        <button
                          style={{
                            display: 'inline-block',
                            padding: '0.4rem 0.8rem',
                            backgroundColor: 'transparent',
                            border: '2px solid #e74c3c',
                            color: '#e74c3c',
                            borderRadius: '5px',
                            fontWeight: 600,
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          <FaEye /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  gap: '0.5rem',
                }}
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '5px',
                    backgroundColor: '#f8f9fa',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    border: 'none',
                  }}
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '5px',
                        backgroundColor:
                          currentPage === page ? '#e74c3c' : '#f8f9fa',
                        color: currentPage === page ? 'white' : '#2c3e50',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        border: 'none',
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '5px',
                    backgroundColor: '#f8f9fa',
                    cursor:
                      currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    border: 'none',
                  }}
                >
                  <FaChevronRight />
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'rgba(44, 62, 80, 0.9)',
          color: 'white',
          padding: '2rem 5%',
          marginTop: '3rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FaRunning /> Sport Sphere
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            &copy; 2025 Sport Sphere. Admin Panel v2.4.1
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminPaymentManagement;
