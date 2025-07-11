import React, { useEffect, useState } from 'react';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/orders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
                <th>Products</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6).toUpperCase()}</td>
                  <td>{new Date(order.paymentDate).toLocaleString()}</td>
                  <td>
                    {order.products.map((p, idx) => (
                      <div key={idx}>
                        {p.quantity} x {p.name || p.productId}
                      </div>
                    ))}
                  </td>
                  <td>Rs. {order.totalAmount}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AthleteLayout>
  );
};

export default MyOrders;
