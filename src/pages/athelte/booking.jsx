import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AthleteLayout from '../../components/AthleteLayout';
import '../../css/booking.css';

const BookingPage = () => {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState('');
  const [coachDescription, setCoachDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Get athlete ID from localStorage
  const userStr = localStorage.getItem('user');
  const athleteId = userStr ? JSON.parse(userStr)._id : null;

  // Fetch coaches from API
  useEffect(() => {
    const fetchCoaches = async () => {
      setLoadingCoaches(true);
      try {
        const res = await fetch('/api/coaches');
        const data = await res.json();
        setCoaches(data);
      } catch (err) {
        setErrorMsg('Failed to load coaches.');
      } finally {
        setLoadingCoaches(false);
      }
    };
    fetchCoaches();
  }, []);

  // Set coach description when coach is selected
  useEffect(() => {
    if (!selectedCoach) {
      setCoachDescription('');
      return;
    }
    const coach = coaches.find((c) => c._id === selectedCoach);
    if (coach) {
      setCoachDescription(coach.bio || coach.about || '');
    } else {
      setCoachDescription('');
    }
  }, [selectedCoach, coaches]);

  // Validate date and time (must be in the future)
  const isFutureDateTime = () => {
    if (!date || !time) return false;
    const selected = new Date(`${date}T${time}`);
    return selected > new Date();
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!selectedCoach || !date || !time) {
      setErrorMsg('Please fill all required fields.');
      return;
    }
    if (!isFutureDateTime()) {
      setErrorMsg('Please select a future date and time.');
      return;
    }
    if (!athleteId) {
      setErrorMsg('User not logged in.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coach: selectedCoach,
          athlete: athleteId,
          date,
          time,
          notes,
        }),
      });
      if (!res.ok) throw new Error('Failed to book session');
      setSuccessMsg('Session booked successfully!');
      setSelectedCoach('');
      setDate('');
      setTime('');
      setNotes('');
      setCoachDescription('');
    } catch (err) {
      setErrorMsg('Failed to book session. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AthleteLayout>
      <div className='booking-container'>
        <h2 className='booking-heading'>
          <i className='fas fa-calendar-check'></i> Book a Session
        </h2>
        <div className='booking-form'>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='coach'>Select Coach</label>
              {loadingCoaches ? (
                <div style={{ color: '#e74c3c' }}>Loading coaches...</div>
              ) : (
                <select
                  id='coach'
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value='' disabled>
                    Choose a coach
                  </option>
                  {coaches.map((coach) => (
                    <option key={coach._id} value={coach._id}>
                      {coach.name} –{' '}
                      {coach.specialties?.[0] || coach.sports || ''} – PKR{' '}
                      {coach.hourlyRate || 0}/hr
                    </option>
                  ))}
                </select>
              )}
            </div>
            {coachDescription && (
              <div
                id='coach-description'
                style={{
                  marginBottom: '1.5rem',
                  color: '#2c3e50',
                  fontSize: '1rem',
                }}
              >
                {coachDescription}
              </div>
            )}
            <div className='form-group'>
              <label htmlFor='date'>Session Date</label>
              <input
                type='date'
                id='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={submitting}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='time'>Session Time</label>
              <input
                type='time'
                id='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='notes'>Special Requests (Optional)</label>
              <textarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific areas you'd like to focus on..."
                disabled={submitting}
              ></textarea>
            </div>
            {errorMsg && (
              <div style={{ color: '#e74c3c', marginBottom: 10 }}>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ color: 'green', marginBottom: 10 }}>
                {successMsg}
              </div>
            )}
            <button
              type='submit'
              className='btn'
              disabled={
                submitting || loadingCoaches || !selectedCoach || !date || !time
              }
            >
              <i className='fas fa-lock'></i>{' '}
              {submitting ? 'Booking...' : 'Confirm & Pay'}
            </button>
          </form>
          <button
            type='button'
            className='btn'
            style={{ backgroundColor: '#7f8c8d', marginTop: '1rem' }}
            onClick={() => navigate('/athlete/dashboard')}
            disabled={submitting}
          >
            <i className='fas fa-times-circle'></i> Cancel Booking
          </button>
        </div>
      </div>
    </AthleteLayout>
  );
};

export default BookingPage;
