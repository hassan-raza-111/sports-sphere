import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/Logo.png';



function Messages() {
  return (
    
    <>
            
            <style>{`
            * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Arial', sans-serif;
    }

    body {
      color: #333;
      line-height: 1.6;
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                  url('https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
      min-height: 100vh;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    /* Header styles - matching previous pages */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 5%;
      background-color: rgba(255, 255, 255, 0.95);
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-img {
      height: 40px;
      width: auto;
    }

    .logo-text {
      font-size: 1.8rem;
      font-weight: bold;
      color: #2c3e50;
      font-style: italic;
    }

    .logo-tagline {
      font-size: 0.8rem;
      color: #7f8c8d;
      margin-top: 3px;
    }

    nav {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    nav a {
      font-weight: 600;
      color: #2c3e50;
      transition: color 0.3s;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    nav a:hover, nav a.active {
      color: #e74c3c;
    }

    .notification-badge {
      background-color: #e74c3c;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 5px;
    }

    .profile-btn {
      background-color: #e74c3c;
      color: white !important;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s;
    }

    .profile-btn:hover {
      background-color: #c0392b;
    }

    /* Messages page styles */
    .messages-container {
      padding: 140px 5% 60px;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 1.5rem;
      height: calc(100vh - 200px);
    }

    .conversation-list {
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #e74c3c;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .conversation-header {
      padding: 1.5rem;
      background-color: #e74c3c;
      color: white;
      font-size: 1.2rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .conversation-search {
      padding: 1rem;
      border-bottom: 1px solid #e1e5eb;
    }

    .conversation-search input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 2.5rem;
      border: 2px solid #e1e5eb;
      border-radius: 5px;
      font-size: 0.9rem;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%237f8c8d' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: 1rem center;
    }

    .conversation-search input:focus {
      border-color: #e74c3c;
      outline: none;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
    }

    .conversation-items {
      flex: 1;
      overflow-y: auto;
    }

    .conversation-item {
      padding: 1rem;
      border-bottom: 1px solid #e1e5eb;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .conversation-item:hover {
      background-color: #f8f9fa;
    }

    .conversation-item.active {
      background-color: #f1f3f5;
    }

    .conversation-avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: #2c3e50;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .conversation-info {
      flex: 1;
      min-width: 0;
    }

    .conversation-name {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.3rem;
      display: flex;
      justify-content: space-between;
    }

    .conversation-time {
      font-size: 0.8rem;
      color: #7f8c8d;
    }

    .conversation-preview {
      font-size: 0.9rem;
      color: #7f8c8d;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .unread-badge {
      background-color: #e74c3c;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.5rem;
    }

    .chat-container {
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #e74c3c;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .chat-header {
      padding: 1.2rem;
      border-bottom: 1px solid #e1e5eb;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .chat-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #2c3e50;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .chat-user-info {
      flex: 1;
    }

    .chat-name {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.2rem;
    }

    .chat-status {
      font-size: 0.9rem;
      color: #7f8c8d;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #2ecc71;
    }

    .chat-messages {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      max-width: 70%;
      padding: 0.8rem 1rem;
      border-radius: 10px;
      line-height: 1.5;
      position: relative;
    }

    .message-received {
      align-self: flex-start;
      background-color: #f1f3f5;
      border-top-left-radius: 0;
    }

    .message-sent {
      align-self: flex-end;
      background-color: #e74c3c;
      color: white;
      border-top-right-radius: 0;
    }

    .message-time {
      font-size: 0.75rem;
      margin-top: 0.5rem;
      opacity: 0.7;
      text-align: right;
    }

    .chat-input {
      padding: 1rem;
      border-top: 1px solid #e1e5eb;
      display: flex;
      gap: 0.8rem;
    }

    .chat-input input {
      flex: 1;
      padding: 0.8rem 1.2rem;
      border: 2px solid #e1e5eb;
      border-radius: 25px;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .chat-input input:focus {
      border-color: #e74c3c;
      outline: none;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
    }

    .send-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #e74c3c;
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .send-btn:hover {
      background-color: #c0392b;
    }

    /* Footer styles */
    footer {
      background-color: rgba(44, 62, 80, 0.9);
      color: white;
      padding: 2rem 5%;
      margin-top: 3rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-logo {
      font-size: 1.5rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .copyright {
      font-size: 0.9rem;
    }

    /* Responsive adjustments */
    @media (max-width: 992px) {
      .messages-container {
        grid-template-columns: 300px 1fr;
      }
    }

    @media (max-width: 768px) {
      header {
        padding: 1rem 5%;
        flex-direction: column;
        gap: 1rem;
      }

      nav {
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .messages-container {
        padding-top: 160px;
        grid-template-columns: 1fr;
        height: auto;
      }

      .conversation-list {
        display: none;
      }
    }

    @media (max-width: 576px) {
      .message {
        max-width: 85%;
      }
      
      .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
        
           `}</style>

      <header>
        <Link to="/" className="logo">
          <img src={logo} alt="Sport Sphere Logo" className="logo-img" />
          <div className="logo-text">Sports Sphere</div>
        </Link>
        <nav>
          <Link to="/"><i className="fas fa-home"></i> <span>Home</span></Link>
          <Link to="/athlete"><i className="fas fa-tachometer-alt"></i> <span>Dashboard</span></Link>
        </nav>
      </header>

      <main className="messages-container">
        <div className="conversation-list">
          <div className="conversation-header">
            <i className="fas fa-comments"></i> Conversations
          </div>
          <div className="conversation-search">
            <input type="text" placeholder="Search conversations..." />
          </div>
          <div className="conversation-items">
            {/* Sample Conversations */}
            {[
              { name: 'Coach Mike', avatar: 'CM', preview: 'Your form has really improved lately!', time: '10:30 AM', unread: false, active: true },
              { name: 'Coach Sarah', avatar: 'SW', preview: 'Don\'t forget about our session tomorrow', time: 'Yesterday', unread: 2 },
              { name: 'Coach Jessica', avatar: 'JL', preview: 'I\'ve reviewed your latest metrics...', time: 'Jun 5' },
              { name: 'Coach David', avatar: 'DC', preview: 'The new training plan is ready for you', time: 'Jun 3' },
            ].map((conv, index) => (
              <div className={`conversation-item ${conv.active ? 'active' : ''}`} key={index}>
                <div className="conversation-avatar">{conv.avatar}</div>
                <div className="conversation-info">
                  <div className="conversation-name">
                    {conv.name}
                    <span className="conversation-time">{conv.time}</span>
                  </div>
                  <div className="conversation-preview">{conv.preview}</div>
                </div>
                {conv.unread && <div className="unread-badge">{conv.unread}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-avatar">CM</div>
            <div className="chat-user-info">
              <div className="chat-name">Coach Mike</div>
              <div className="chat-status">
                <span className="status-indicator"></span> Online
              </div>
            </div>
          </div>

          <div className="chat-messages">
            <div className="message message-received">Hey! Your form has really improved lately!<div className="message-time">10:30 AM</div></div>
            <div className="message message-sent">Thanks coach! Looking forward to the next session.<div className="message-time">10:32 AM</div></div>
            <div className="message message-received">I've scheduled drills for Thursday at 4pm.<div className="message-time">10:33 AM</div></div>
            <div className="message message-sent">Perfect! Should I bring anything?<div className="message-time">10:35 AM</div></div>
            <div className="message message-received">Just your regular gear.<div className="message-time">10:36 AM</div></div>
          </div>

          <div className="chat-input">
            <input type="text" placeholder="Type your message..." />
            <button className="send-btn"><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </main>
    </>
  );
}

export default Messages;
