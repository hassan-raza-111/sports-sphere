import React, { useEffect, useState } from 'react';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/orders.css';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className='order-modal-backdrop'>
      <div className='order-modal'>
        <button className='close-modal-btn' onClick={onClose}>
          &times;
        </button>
        <h3>Order Details</h3>
        <div className='order-modal-section'>
          <strong>Order ID:</strong> {order._id}
        </div>
        <div className='order-modal-section'>
          <strong>Date:</strong> {new Date(order.paymentDate).toLocaleString()}
        </div>
        <div className='order-modal-section'>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </div>
        <div className='order-modal-section'>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </div>
        <div className='order-modal-section'>
          <strong>Total:</strong> Rs. {order.totalAmount}
        </div>
        {/* <div className='order-modal-section'>
          <strong>Shipping Info:</strong>
          <div className='shipping-info-modal'>
            {order.shippingInfo ? (
              typeof order.shippingInfo === 'object' ? (
                <ul>
                  {Object.entries(order.shippingInfo).map(([key, value]) => (
                    <li key={key}>
                      <b>{key.charAt(0).toUpperCase() + key.slice(1)}:</b>{' '}
                      {value}
                    </li>
                  ))}
                </ul>
              ) : (
                <span>{order.shippingInfo}</span>
              )
            ) : (
              <span>No shipping info available</span>
            )}
          </div>
        </div> */}
        <div className='order-modal-section'>
          <strong>Order Status:</strong> {order.status}
        </div>
        <div className='order-modal-section'>
          <strong>Products:</strong>
          <div className='order-products-list'>
            {order.products.map((p, idx) => {
              // Support both populated and non-populated product fields
              const prod =
                p.productId && typeof p.productId === 'object'
                  ? p.productId
                  : {};
              const name = prod.name || p.name || p.productId || 'Product';
              const image = prod.image || p.image || '';
              const price = prod.price || p.price || '-';
              return (
                <div className='order-product-item' key={idx}>
                  <div className='order-product-img'>
                    {image ? (
                      <img
                        src={
                          image.startsWith('http')
                            ? image
                            : `http://localhost:5000${image}`
                        }
                        alt={name}
                      />
                    ) : (
                      <div className='no-img'>No Image</div>
                    )}
                  </div>
                  <div className='order-product-info'>
                    <div>
                      <b>{name}</b>
                    </div>
                    <div>Qty: {p.quantity}</div>
                    <div>Price: Rs. {price}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?._id;

    if (!userId) return;

    fetch(`http://localhost:5000/api/orders?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AthleteLayout>
      <div className='orders-container'>
        <h2>My Orders</h2>
        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <table className='orders-table'>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Order Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6).toUpperCase()}</td>
                  <td>{new Date(order.paymentDate).toLocaleString()}</td>
                  <td>Rs. {order.totalAmount}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className='view-details-btn'
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </AthleteLayout>
  );
};

export default MyOrders;
