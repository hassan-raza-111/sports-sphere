import React, { useState, useEffect } from 'react';
import VendorLayout from '../../components/VendorLayout';
import '../../css/vendor-panel.css';

const BACKEND_URL = 'http://localhost:5000';

export default function EarningsOverview() {
  const [earnings, setEarnings] = useState(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningsError, setEarningsError] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState('');
  const [payoutError, setPayoutError] = useState('');
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [payoutHistoryLoading, setPayoutHistoryLoading] = useState(false);

  // Get vendorId from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const vendorId = user?._id;

  // Fetch vendor earnings
  useEffect(() => {
    if (!vendorId) return;
    setEarningsLoading(true);
    setEarningsError(null);
    fetch(`${BACKEND_URL}/api/orders/vendor/${vendorId}/earnings`)
      .then((res) => res.json())
      .then((data) => {
        setEarnings(data);
        setEarningsLoading(false);
      })
      .catch(() => {
        setEarningsError('Failed to fetch earnings');
        setEarningsLoading(false);
      });
    // Fetch payout history from new endpoint
    setPayoutHistoryLoading(true);
    fetch(`${BACKEND_URL}/api/payout-requests/vendor/${vendorId}/history`)
      .then((res) => res.json())
      .then((data) => {
        setPayoutHistory(data);
        setPayoutHistoryLoading(false);
      })
      .catch(() => setPayoutHistoryLoading(false));
  }, [vendorId]);

  const handlePayoutRequest = async (e) => {
    e.preventDefault();
    setPayoutLoading(true);
    setPayoutError('');
    setPayoutSuccess('');
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/payout-requests/vendor/${vendorId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: payoutAmount,
            notes: payoutNotes,
          }),
        }
      );
      if (!res.ok) throw new Error('Failed to create payout request');
      setPayoutSuccess('Payout request submitted successfully!');
      setPayoutAmount('');
      setPayoutNotes('');
      // Refresh payout history
      const historyRes = await fetch(
        `${BACKEND_URL}/api/payout-requests/vendor/${vendorId}/history`
      );
      const historyData = await historyRes.json();
      setPayoutHistory(historyData);
    } catch (err) {
      setPayoutError('Failed to submit payout request');
    } finally {
      setPayoutLoading(false);
    }
  };

  return (
    <VendorLayout>
      <div className='container'>
        <h1>Earnings Overview</h1>

        {earningsLoading ? (
          <div>Loading earnings...</div>
        ) : earningsError ? (
          <div style={{ color: 'red' }}>{earningsError}</div>
        ) : earnings ? (
          <div style={{ display: 'flex', gap: 30, marginBottom: 30 }}>
            <div
              style={{
                background: '#f9fafb',
                padding: 20,
                borderRadius: 8,
                border: '1px solid #ddd',
                minWidth: 150,
              }}
            >
              <b>Total Sales</b>
              <div style={{ fontSize: 22, color: '#27ae60' }}>
                PKR {earnings.totalSales?.toFixed(2)}
              </div>
            </div>
            <div
              style={{
                background: '#f9fafb',
                padding: 20,
                borderRadius: 8,
                border: '1px solid #ddd',
                minWidth: 150,
              }}
            >
              <b>Pending</b>
              <div style={{ fontSize: 22, color: '#e67e22' }}>
                PKR {earnings.pending?.toFixed(2)}
              </div>
            </div>
            <div
              style={{
                background: '#f9fafb',
                padding: 20,
                borderRadius: 8,
                border: '1px solid #ddd',
                minWidth: 150,
              }}
            >
              <b>Approved</b>
              <div style={{ fontSize: 22, color: '#2980b9' }}>
                PKR {earnings.approved?.toFixed(2)}
              </div>
            </div>
            <div
              style={{
                background: '#f9fafb',
                padding: 20,
                borderRadius: 8,
                border: '1px solid #ddd',
                minWidth: 150,
              }}
            >
              <b>Rejected</b>
              <div style={{ fontSize: 22, color: '#c0392b' }}>
                PKR {earnings.rejected?.toFixed(2)}
              </div>
            </div>
          </div>
        ) : null}

        <h3>Payout Request</h3>
        <form onSubmit={handlePayoutRequest} style={{ marginBottom: 30 }}>
          <div className='form-group'>
            <label htmlFor='payoutAmount'>Amount (PKR)</label>
            <input
              type='number'
              id='payoutAmount'
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              required
              min={1}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='payoutNotes'>Notes (optional)</label>
            <input
              type='text'
              id='payoutNotes'
              value={payoutNotes}
              onChange={(e) => setPayoutNotes(e.target.value)}
            />
          </div>
          <button type='submit' disabled={payoutLoading}>
            {payoutLoading ? 'Submitting...' : 'Request Payout'}
          </button>
          {payoutSuccess && (
            <div style={{ color: 'green', marginTop: 10 }}>{payoutSuccess}</div>
          )}
          {payoutError && (
            <div style={{ color: 'red', marginTop: 10 }}>{payoutError}</div>
          )}
        </form>

        <h3>Payout History</h3>
        {payoutHistoryLoading ? (
          <div>Loading payout history...</div>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Processed At</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    No payout requests found.
                  </td>
                </tr>
              ) : (
                payoutHistory.map((p) => (
                  <tr key={p._id}>
                    <td>{p.amount}</td>
                    <td
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        color:
                          p.status === 'approved'
                            ? 'green'
                            : p.status === 'rejected'
                            ? 'red'
                            : '#f39c12',
                      }}
                    >
                      {p.status}
                    </td>
                    <td>{new Date(p.requestedAt).toLocaleString()}</td>
                    <td>
                      {p.processedAt
                        ? new Date(p.processedAt).toLocaleString()
                        : '-'}
                    </td>
                    <td>{p.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </VendorLayout>
  );
}
