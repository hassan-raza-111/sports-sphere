import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../../config.js';
import VendorLayout from '../../components/VendorLayout';
import '../../css/vendor-panel.css';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  // Get vendorId from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const vendorId = user?._id;

  // Fetch vendor orders
  useEffect(() => {
    if (!vendorId) return;
    setOrdersLoading(true);
    setOrderError(null);
    fetch(`${BACKEND_URL}/api/orders/vendor/${vendorId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      })
      .catch(() => {
        setOrderError('Failed to fetch orders');
        setOrdersLoading(false);
      });
  }, [vendorId]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setStatusUpdating(orderId);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleViewOrder = async (orderId) => {
    setOrderDetail('loading');
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      const data = await res.json();
      setOrderDetail(data);
    } catch (err) {
      alert('Failed to fetch order details');
      setOrderDetail(null);
    }
  };

  return (
    <VendorLayout>
      <div className='container'>
        <h1>Order Management</h1>

        {ordersLoading ? (
          <div>Loading orders...</div>
        ) : orderError ? (
          <div style={{ color: 'red' }}>{orderError}</div>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Products</th>
                <th>Buyer</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.products.map((p, i) => (
                      <div key={i}>
                        {p.productId?.name || 'Product'} x{p.quantity}
                      </div>
                    ))}
                  </td>
                  <td>{order.userId?.name || 'N/A'}</td>
                  <td>
                    <select
                      value={order.status}
                      disabled={statusUpdating === order._id}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                    >
                      <option value='pending'>Pending</option>
                      <option value='process'>Process</option>
                      <option value='shipped'>Shipped</option>
                      <option value='completed'>Completed</option>
                      <option value='cancelled'>Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    {order.totalAmount
                      ? `PKR ${order.totalAmount.toFixed(2)}`
                      : '-'}
                  </td>
                  <td>
                    <button onClick={() => handleViewOrder(order._id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Order Details Modal */}
        {orderDetail && orderDetail !== 'loading' && (
          <div
            className='modal'
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: 30,
                borderRadius: 10,
                minWidth: 350,
                maxWidth: 500,
              }}
            >
              <h3>Order Details</h3>
              <div>
                <b>Order ID:</b> {orderDetail._id}
              </div>
              <div>
                <b>Buyer:</b> {orderDetail.userId?.name} (
                {orderDetail.userId?.email})
              </div>
              <div>
                <b>Status:</b> {orderDetail.status}
              </div>
              <div>
                <b>Date:</b> {new Date(orderDetail.createdAt).toLocaleString()}
              </div>
              <div>
                <b>Amount:</b> PKR {orderDetail.totalAmount?.toFixed(2)}
              </div>
              <div>
                <b>Products:</b>
                <ul>
                  {orderDetail.products.map((p, i) => (
                    <li key={i}>
                      {p.productId?.name || 'Product'} x{p.quantity} (PKR{' '}
                      {p.price})
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <b>Shipping:</b>{' '}
                {orderDetail.shippingInfo
                  ? JSON.stringify(orderDetail.shippingInfo)
                  : 'N/A'}
              </div>
              <button
                onClick={() => setOrderDetail(null)}
                style={{ marginTop: 15 }}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {orderDetail === 'loading' && <div>Loading order details...</div>}
      </div>
    </VendorLayout>
  );
}
