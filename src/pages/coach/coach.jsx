import React, { useEffect, useState } from 'react';
import '../../css/coach.css';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/Logo.png';
import {
  FaHome,
  FaStore,
  FaEnvelope,
  FaUser,
  FaHandshake,
  FaRunning,
} from 'react-icons/fa';

function Coach() {
  const [coachName, setCoachName] = useState('Coach');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setCoachName(user.name);
    }
  }, []);

  return (
    <div>
      <header>
        <Link to='/' className='logo'>
          <img src={logoImg} alt='Sport Sphere Logo' className='logo-img' />
          <div>
            <div className='logo-text'>Sports Sphere</div>
          </div>
        </Link>
        <nav>
          <Link to='/coach' className='active'>
            <FaHome /> <span>Home</span>
          </Link>
          <Link to='/coach/coach-marketplace'>
            <FaHome /> <span>Marketplace</span>
          </Link>
          <Link to='/coach-messages'>
            <FaEnvelope />
            <span>Messages</span>
            <span className='notification-badge'>3</span>
          </Link>
          <Link to='/coach/progress'>
            <FaStore /> <span>Coach Progress</span>
          </Link>
          <Link to='/coach-profile' className='profile-btn'>
            <FaUser />
          </Link>
        </nav>
      </header>

      <main className='dashboard'>
        <h2>
          <i className='fas fa-chalkboard-teacher'></i> Welcome, {coachName}!
        </h2>

        <section className='feature-section'>
          <div className='card'>
            <h3>
              <i className='fas fa-chart-bar'></i> Progress Reports
            </h3>
            <p>
              Monitor athlete performance with detailed analytics and easily
              track their training journey.
            </p>
            <Link to='/progress' className='btn secondary'>
              <i className='fas fa-file-alt'></i> View Progress
            </Link>
          </div>

          <div className='card'>
            <h3>
              <i className='fas fa-comments'></i> Athlete Communication
            </h3>
            <p>
              Stay connected through instant messaging, share training plans,
              and provide session feedback in real time.
            </p>
            <Link to='/message' className='btn primary'>
              <i className='fas fa-inbox'></i> Go to Messages
            </Link>
          </div>
        </section>

        <section className='sessions-section'>
          <h3>
            <i className='fas fa-clock'></i> Upcoming Sessions (Next 7 Days)
          </h3>
          <div className='sessions-list'>
            {[
              {
                date: 'Mon, Jun 5',
                athlete: 'Alex Morgan',
                time: '3:00 PM - 4:30 PM',
              },
              {
                date: 'Tue, Jun 6',
                athlete: 'Jamie Johnson',
                time: '10:00 AM - 11:30 AM',
              },
              {
                date: 'Wed, Jun 7',
                athlete: 'Taylor Smith',
                time: '5:00 PM - 6:30 PM',
              },
              {
                date: 'Fri, Jun 9',
                athlete: 'Jordan Lee',
                time: '4:00 PM - 5:30 PM',
              },
            ].map((session, index) => (
              <div className='session-item' key={index}>
                <div className='date'>{session.date}</div>
                <div className='athlete'>
                  <i className='fas fa-user'></i> {session.athlete}
                </div>
                <div className='time'>{session.time}</div>
                <div className='action-btn'>
                  <Link to='#' className='btn small-btn'>
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className='stats-overview'>
          <div className='stat-card'>
            <div className='value'>12</div>
            <div className='label'>Upcoming Sessions</div>
          </div>
          <div className='stat-card'>
            <div className='value'>4.9</div>
            <div className='label'>Average Rating</div>
          </div>
          <div className='stat-card'>
            <div className='value'>87%</div>
            <div className='label'>Athlete Retention</div>
          </div>
          <div className='stat-card'>
            <div className='value'>5</div>
            <div className='label'>New Athletes</div>
          </div>
        </div>
      </main>

      <footer>
        <div className='footer-content'>
          <div className='footer-logo'>
            <i className='fas fa-running'></i> Sport Sphere
          </div>
          <div className='copyright'>
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Coach;
