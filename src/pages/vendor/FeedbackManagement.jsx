import React, { useState, useEffect } from 'react';
import { API_BASE_URL, BACKEND_URL } from '../../config.js';
import VendorLayout from '../../components/VendorLayout';
import '../../css/vendor-panel.css';

export default function FeedbackManagement() {
  const [feedbackTabLoading, setFeedbackTabLoading] = useState(true);
  const [feedbackTabError, setFeedbackTabError] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);

  // Get vendorId from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const vendorId = user?._id;

  // Fetch vendor feedback
  useEffect(() => {
    if (!vendorId) return;
    setFeedbackTabLoading(true);
    setFeedbackTabError(null);
    fetch(`${API_BASE_URL}/feedback/vendor/${vendorId}`)
      .then((res) => res.json())
      .then((data) => {
        setFeedbackList(data);
        setFeedbackTabLoading(false);
      })
      .catch(() => {
        setFeedbackTabError('Failed to fetch feedback');
        setFeedbackTabLoading(false);
      });
  }, [vendorId]);

  return (
    <VendorLayout>
      <div className='container'>
        <h1>Product Feedback</h1>

        {feedbackTabLoading ? (
          <div>Loading feedback...</div>
        ) : feedbackTabError ? (
          <div style={{ color: 'red' }}>{feedbackTabError}</div>
        ) : feedbackList.length === 0 ? (
          <div>No feedback found.</div>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>Product</th>
                <th>Rating</th>
                <th>Feedback</th>
                <th>Buyer</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((fb) => (
                <tr key={fb._id}>
                  <td>{fb.productId?.name || '-'}</td>
                  <td>
                    {'★'.repeat(fb.rating)}
                    {'☆'.repeat(5 - fb.rating)}
                  </td>
                  <td>{fb.feedbackText}</td>
                  <td>{fb.userId?.name || fb.email || '-'}</td>
                  <td>{new Date(fb.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </VendorLayout>
  );
}
