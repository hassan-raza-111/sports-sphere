import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { API_BASE_URL } from '../../config.js';

function AdminPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchPayouts();
  }, [refresh]);

  const fetchPayouts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/payout-requests`);
      const data = await res.json();
      setPayouts(data.payoutRequests || []);
    } catch (err) {
      setError('Failed to fetch payout requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    if (
      !window.confirm(`Are you sure you want to ${status} this payout request?`)
    )
      return;
    try {
      const res = await fetch(`${API_BASE_URL}/payout-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      setRefresh((r) => !r);
    } catch (err) {
      alert('Error updating payout request');
    }
  };

  return (
    <AdminLayout>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'white' }}>
        Vendor Payout Requests
      </h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: 8,
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7f7f7' }}>
                <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  Vendor
                </th>
                <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  Amount
                </th>
                <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  Status
                </th>
                <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  Requested At
                </th>
                <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  Processed At
                </th>
                <th style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                    No payout requests found.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p._id}>
                    <td style={{ padding: 10 }}>
                      {p.vendorId?.name || 'N/A'}
                      <br />
                      <span style={{ color: '#888', fontSize: 12 }}>
                        {p.vendorId?.email}
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>{p.amount}</td>
                    <td style={{ padding: 10 }}>
                      <span
                        style={{
                          color:
                            p.status === 'approved'
                              ? 'green'
                              : p.status === 'rejected'
                              ? 'red'
                              : '#f39c12',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>
                      {new Date(p.requestedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: 10 }}>
                      {p.processedAt
                        ? new Date(p.processedAt).toLocaleString()
                        : '-'}
                    </td>
                    <td style={{ padding: 10 }}>
                      {p.status === 'pending' && (
                        <>
                          <button
                            style={{
                              marginRight: 8,
                              background: 'green',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              padding: '6px 12px',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleAction(p._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            style={{
                              background: 'red',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              padding: '6px 12px',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleAction(p._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminPayouts;
