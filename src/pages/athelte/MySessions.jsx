import React, { useEffect, useState } from 'react';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/athlete.css';

const STATUS_LABELS = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
const PAYMENT_LABELS = {
  pending: 'Pending',
  authorized: 'Authorized',
  captured: 'Captured',
  refunded: 'Refunded',
  failed: 'Failed',
};

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Get athlete ID from localStorage
  const userStr = localStorage.getItem('user');
  const athleteId = userStr ? JSON.parse(userStr)._id : null;

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/booking/athlete/${athleteId}/all`);
        if (!res.ok) throw new Error('Failed to fetch sessions');
        const data = await res.json();
        setSessions(data.bookings || []);
      } catch (err) {
        setError('Failed to load sessions.');
      } finally {
        setLoading(false);
      }
    };
    if (athleteId) fetchSessions();
  }, [athleteId]);

  const filteredSessions =
    activeTab === 'all'
      ? sessions
      : sessions.filter((s) => s.status === activeTab);

  return (
    <AthleteLayout>
      <div className='athlete-sessions-container'>
        <h2 className='athlete-sessions-heading'>
          <i className='fas fa-calendar-alt'></i> My Sessions
        </h2>
        <div className='athlete-sessions-tabs'>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`athlete-sessions-tab${
                activeTab === tab.key ? ' active' : ''
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className='athlete-sessions-loading'>Loading sessions...</div>
        ) : error ? (
          <div className='athlete-sessions-error'>{error}</div>
        ) : filteredSessions.length === 0 ? (
          <div className='athlete-sessions-empty'>No sessions found.</div>
        ) : (
          <div className='athlete-sessions-list'>
            {filteredSessions.map((session) => (
              <div className='athlete-session-card' key={session._id}>
                <div className='athlete-session-row'>
                  <span className='athlete-session-label'>Coach:</span>
                  <span className='athlete-session-value'>
                    {session.coach?.name || 'Coach'}
                  </span>
                </div>
                <div className='athlete-session-row'>
                  <span className='athlete-session-label'>Date:</span>
                  <span className='athlete-session-value'>{session.date}</span>
                </div>
                <div className='athlete-session-row'>
                  <span className='athlete-session-label'>Time:</span>
                  <span className='athlete-session-value'>{session.time}</span>
                </div>
                <div className='athlete-session-row'>
                  <span className='athlete-session-label'>Status:</span>
                  <span
                    className={`athlete-session-status status-${session.status}`}
                  >
                    {STATUS_LABELS[session.status] || session.status}
                  </span>
                </div>
                <div className='athlete-session-row'>
                  <span className='athlete-session-label'>Payment:</span>
                  <span
                    className={`athlete-session-payment payment-${session.paymentStatus}`}
                  >
                    {PAYMENT_LABELS[session.paymentStatus] ||
                      session.paymentStatus}
                  </span>
                </div>
                {session.notes && (
                  <div className='athlete-session-row'>
                    <span className='athlete-session-label'>Notes:</span>
                    <span className='athlete-session-value'>
                      {session.notes}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AthleteLayout>
  );
};

export default MySessions;
