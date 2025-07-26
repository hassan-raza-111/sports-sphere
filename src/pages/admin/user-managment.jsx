import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config.js';
import logoImg from '../../assets/images/Logo.png';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
const userStyles = `
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
  /* User Management styles */
  .user-container {
    padding: 140px 5% 60px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .user-heading {
    font-size: 2.2rem;
    color: white;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 15px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
  .user-tabs {
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
  .user-content {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #e74c3c;
    overflow: hidden;
  }
  .user-filters {
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
  .role-filter {
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
  .users-table {
    width: 100%;
    border-collapse: collapse;
  }
  .users-table th,
  .users-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e1e5eb;
  }
  .users-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
  }
  .users-table tr:hover {
    background-color: #f8f9fa;
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.5rem;
  }
  .user-name {
    display: flex;
    align-items: center;
  }
  .role {
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .role.athlete {
    background-color: #d1ecf1;
    color: #0c5460;
  }
  .role.coach {
    background-color: #d4edda;
    color: #155724;
  }
  .role.admin {
    background-color: #f8d7da;
    color: #721c24;
  }
  .role.vendor {
    background-color: #fff3cd;
    color: #856404;
  }
  .status {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  .status.active {
    background-color: #28a745;
  }
  .status.inactive {
    background-color: #dc3545;
  }
  .status.pending {
    background-color: #ffc107;
  }
  .action-dropdown {
    position: relative;
    display: inline-block;
  }
  .dropdown-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #6c757d;
    font-size: 1.2rem;
  }
  .dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    background-color: white;
    min-width: 160px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    border-radius: 5px;
    z-index: 1;
    border: 1px solid #e1e5eb;
  }
  .action-dropdown:hover .dropdown-content {
    display: block;
  }
  .dropdown-content a {
    color: #333;
    padding: 0.8rem 1rem;
    text-decoration: none;
    display: block;
    font-size: 0.9rem;
  }
  .dropdown-content a:hover {
    background-color: #f8f9fa;
    color: #e74c3c;
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
    margin-bottom: 2rem;
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
  /* Responsive */
  @media(max-width:768px){
    .users-table {
      display: block;
      overflow-x: auto;
    }
  }
`;

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError('Could not load users.');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Filter users based on search, role, and status
  const filteredUsers = users.filter((user) => {
    const roleMatch =
      roleFilter === 'All Roles' ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
    const statusMatch =
      statusFilter === 'All Statuses' ||
      user.status.toLowerCase() === statusFilter.toLowerCase();
    const searchMatch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return roleMatch && statusMatch && searchMatch;
  });

  // Helper to refresh users
  const refreshUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  // Activate/Deactivate user
  const handleStatusChange = async (user) => {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    if (
      !window.confirm(`Are you sure you want to set this user as ${newStatus}?`)
    )
      return;
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');
      alert(data.message);
      refreshUsers();
    } catch (err) {
      alert('Error updating status.');
    }
  };

  // Reset user password
  const handleResetPassword = async (user) => {
    const newPassword = window.prompt('Enter new password for this user:');
    if (!newPassword) return;
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user._id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      alert(data.message);
    } catch (err) {
      alert('Error resetting password.');
    }
  };

  return (
    <AdminLayout>
      {/* Inject styles */}
      <style dangerouslySetInnerHTML={{ __html: userStyles }} />
      {/* Main user management content only (remove header/footer) */}
      <div className='user-container'>
        {/* Add User Button (now navigates to add user page) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1.5rem',
          }}
        >
          <Link to='/admin/add-user' className='btn'>
            + Add User
          </Link>
        </div>
        <h2 className='user-heading'>
          <i className='fas fa-users'></i> User Management
        </h2>

        {/* Stats Overview */}
        <div className='stats-overview'>
          <div className='stat-card'>
            <div className='value'>{users.length}</div>
            <div className='label'>Total Users</div>
          </div>
          <div className='stat-card'>
            <div className='value'>
              {users.filter((u) => u.role === 'athlete').length}
            </div>
            <div className='label'>Athletes</div>
          </div>
          <div className='stat-card'>
            <div className='value'>
              {users.filter((u) => u.role === 'coach').length}
            </div>
            <div className='label'>Coaches</div>
          </div>
          <div className='stat-card'>
            <div className='value'>
              {users.filter((u) => u.role === 'vendor').length}
            </div>
            <div className='label'>Vendors</div>
          </div>
        </div>

        {/* User Table */}
        <div className='user-content'>
          {/* Filters */}
          <div className='user-filters'>
            <div className='filter-group'>
              <input
                type='text'
                className='search-input'
                placeholder='Search users...'
                style={{ width: '300px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className='role-filter'
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option>All Roles</option>
                <option>Athlete</option>
                <option>Coach</option>
                <option>Vendor</option>
                <option>Admin</option>
              </select>
              <select
                className='role-filter'
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <table className='users-table'>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='6'>Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan='6' style={{ color: 'red' }}>
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan='6'>No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className='user-name'>
                        <img
                          src={`https://randomuser.me/api/portraits/lego/${Math.floor(
                            Math.random() * 10
                          )}.jpg`}
                          alt='User'
                          className='user-avatar'
                        />
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role ${user.role}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${user.status}`}></span>{' '}
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </td>
                    <td>{user.createdAt ? formatDate(user.createdAt) : ''}</td>
                    <td>
                      <div className='flex'>
                        <a
                          href='#'
                          onClick={(e) => {
                            e.preventDefault();
                            handleResetPassword(user);
                          }}
                        >
                          <i className='fas fa-lock'></i> Reset Password
                        </a>
                        <hr />
                        <a
                          href='#'
                          onClick={(e) => {
                            e.preventDefault();
                            handleStatusChange(user);
                          }}
                        >
                          <i className='fas fa-ban'></i>{' '}
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
