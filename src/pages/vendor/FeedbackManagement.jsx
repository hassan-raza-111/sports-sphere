import React, { useState, useEffect } from 'react';
import VendorLayout from '../../components/VendorLayout';
import '../../css/vendor-panel.css';

const BACKEND_URL = 'http://localhost:5000';

export default function FeedbackManagement() {
  const [feedbackTabLoading, setFeedbackTabLoading] = useState(true);
  const [feedbackTabError, setFeedbackTabError] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [replying, setReplying] = useState({});
  const [replyText, setReplyText] = useState({});

  // Get vendorId from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const vendorId = user?._id;

  // Fetch vendor feedback
  useEffect(() => {
    if (!vendorId) return;
    setFeedbackTabLoading(true);
    setFeedbackTabError(null);
    fetch(`${BACKEND_URL}/api/feedback/vendor/${vendorId}`)
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

  const handleReplyChange = (id, value) => {
    setReplyText((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = async (id) => {
    if (!replyText[id]?.trim()) return;
    setReplying((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${BACKEND_URL}/api/feedback/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText[id] }),
      });
      if (!res.ok) throw new Error('Failed to reply');
      const updated = feedbackList.map((fb) =>
        fb._id === id
          ? { ...fb, reply: replyText[id], repliedAt: new Date() }
          : fb
      );
      setFeedbackList(updated);
      setReplyText((prev) => ({ ...prev, [id]: '' }));
    } catch (err) {
      alert('Failed to submit reply');
    } finally {
      setReplying((prev) => ({ ...prev, [id]: false }));
    }
  };

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
                <th>Reply</th>
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
                  <td>
                    {fb.reply ? (
                      <div>
                        <div style={{ color: '#2980b9' }}>{fb.reply}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {fb.repliedAt
                            ? 'Replied: ' +
                              new Date(fb.repliedAt).toLocaleString()
                            : ''}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type='text'
                          value={replyText[fb._id] || ''}
                          onChange={(e) =>
                            handleReplyChange(fb._id, e.target.value)
                          }
                          placeholder='Write a reply...'
                          style={{ width: 120 }}
                        />
                        <button
                          onClick={() => handleReplySubmit(fb._id)}
                          disabled={
                            replying[fb._id] ||
                            !(replyText[fb._id] && replyText[fb._id].trim())
                          }
                          style={{ marginLeft: 5 }}
                        >
                          {replying[fb._id] ? 'Replying...' : 'Reply'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </VendorLayout>
  );
}
