import React from "react";

const messagesStyles = `
  /* Reset and base styles */
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

  /* Header Styles */
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

  nav a:hover,
  nav a.active {
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

  /* Messages Page Styles */
  main {
    padding-top: 140px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 140px 5% 60px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .sidebar {
    flex: 1;
    min-width: 280px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border-left: 4px solid #e74c3c;
  }

  .conversation-list {
    max-height: 600px;
    overflow-y: auto;
    padding: 1rem;
  }

  .conversation-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    position: relative;
    transition: background 0.3s;
  }

  .conversation-item:hover {
    background-color: #f8f9fa;
  }

  .conversation-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e74c3c;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
  }

  .conversation-info {
    flex: 1;
    min-width: 0;
  }

  .conversation-name {
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .conversation-time {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-left: 0.5rem;
  }

  .conversation-preview {
    font-size: 0.9rem;
    color: #7f8c8d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 4px;
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
    flex: 2;
    min-width: 300px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    border-left: 4px solid #e74c3c;
  }

  .chat-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
  }

  .chat-header img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }

  .chat-title {
    font-weight: 600;
    color: #2c3e50;
  }

  .chat-subtitle {
    font-size: 0.85rem;
    color: #7f8c8d;
  }

  .chat-body {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    background: #f8f9fa;
    border-bottom: 1px solid #ddd;
  }

  .message {
    display: flex;
    margin-bottom: 1.5rem;
    align-items: start;
    gap: 1rem;
  }

  .message.user {
    justify-content: flex-end;
  }

  .message.user .message-content {
    background-color: #e74c3c;
    color: white;
    border-radius: 15px 5px 5px 15px;
    max-width: 70%;
    margin-left: auto;
  }

  .message.other .message-content {
    background-color: white;
    color: #333;
    border-radius: 5px 15px 15px 5px;
    max-width: 70%;
  }

  .message-content {
    padding: 1rem 1.2rem;
    border-radius: 5px;
    font-size: 0.95rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .chat-footer {
    padding: 1rem 1.5rem;
    background: #fff;
    border-top: 1px solid #ddd;
  }

  .chat-input-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .chat-input {
    flex: 1;
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 20px;
    resize: none;
  }

  .chat-input:focus {
    outline: none;
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }

  .send-btn {
    background-color: #e74c3c;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
    flex-shrink: 0;
  }

  .send-btn:hover {
    background-color: #c0392b;
  }

  /* Empty Chat Placeholder */
  .empty-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    color: #7f8c8d;
    font-size: 1.1rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    border-left: 4px solid #e74c3c;
  }

  .empty-chat i {
    font-size: 2.5rem;
    color: #e74c3c;
    margin-bottom: 1rem;
  }

  /* Responsive adjustments */
  @media (max-width: 992px) {
    main {
      flex-direction: column;
    }
    .sidebar {
      margin-bottom: 20px;
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
    }

    .chat-header img {
      width: 30px;
      height: 30px;
    }

    .chat-input {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 576px) {
    .conversation-name {
      flex-direction: column;
      align-items: flex-start;
    }

    .conversation-time {
      font-size: 0.75rem;
      margin-left: 0;
      margin-top: 5px;
    }

    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
`;

const Messages = () => {
  return (
    <div>
      {/* Inject CSS dynamically */}
      <style dangerouslySetInnerHTML={{ __html: messagesStyles }} />

      <header>
        <a href="/index.html" className="logo">
          <img
            src="/assets/images/Logo.png"
            alt="Sport Sphere Logo"
            className="logo-img"
          />
          <div>
            <div className="logo-text">Sports Sphere</div>
          </div>
        </a>
        <nav>
          <a href="/index.html">
            <i className="fas fa-home"></i> Home
          </a>
          <a href="/coach-dashboard.html" className="active">
            <i className="fas fa-user-shield"></i> Dashboard
          </a>
          <a href="/messages.html">
            <i className="fas fa-envelope"></i> Messages{" "}
            <span className="notification-badge">3</span>
          </a>
          <a href="/coach-profile.html" className="profile-btn">
            <i className="fas fa-user-tie"></i>
          </a>
        </nav>
      </header>

      <main className="messages-container">
        {/* Sidebar - Conversations */}
        <div className="sidebar">
          <div className="conversation-list">
            <div className="conversation-item">
              <div className="conversation-avatar">AM</div>
              <div className="conversation-info">
                <div className="conversation-name">
                  Coach Williams
                  <span className="conversation-time">Today</span>
                </div>
                <div className="conversation-preview">
                  Don't forget about our session tomorrow
                </div>
              </div>
              <div className="unread-badge">2</div>
            </div>

            <div className="conversation-item">
              <div className="conversation-avatar">SW</div>
              <div className="conversation-info">
                <div className="conversation-name">
                  Coach Sarah
                  <span className="conversation-time">Yesterday</span>
                </div>
                <div className="conversation-preview">New message received</div>
              </div>
            </div>

            <div className="conversation-item">
              <div className="conversation-avatar">JL</div>
              <div className="conversation-info">
                <div className="conversation-name">
                  Coach Jessica
                  <span className="conversation-time">Jun 5</span>
                </div>
                <div className="conversation-preview">
                  Let's discuss new training plan
                </div>
              </div>
            </div>

            <div className="conversation-item">
              <div className="conversation-avatar">TC</div>
              <div className="conversation-info">
                <div className="conversation-name">
                  Coach Thompson
                  <span className="conversation-time">May 30</span>
                </div>
                <div className="conversation-preview">
                  You've been assigned to...
                </div>
              </div>
            </div>

            <div className="conversation-item">
              <div className="conversation-avatar">JD</div>
              <div className="conversation-info">
                <div className="conversation-name">
                  Coach Johnson
                  <span className="conversation-time">May 28</span>
                </div>
                <div className="conversation-preview">
                  Session rescheduled for June 15
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-container">
          <div className="chat-header">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Coach Williams"
            />
            <div>
              <div className="chat-title">Coach Williams</div>
              <div className="chat-subtitle">Online</div>
            </div>
          </div>

          <div className="chat-body">
            <div className="message user">
              <div className="message-content">
                Hi Coach! Looking forward to our session tomorrow.
              </div>
            </div>

            <div className="message other">
              <div className="message-content">
                Great! I've updated your workout plan based on recent progress.
              </div>
            </div>

            <div className="message user">
              <div className="message-content">
                Thanks! I'm ready to push harder.
              </div>
            </div>

            <div className="message other">
              <div className="message-content">
                I see that. You're improving quickly!
              </div>
            </div>
          </div>

          <div className="chat-footer">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="chat-input-group">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Type your message..."
                />
                <button type="submit" className="send-btn">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-running"></i> Sport Sphere
          </div>
          <div className="copyright">
            &copy; 2025 Sport Sphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Messages;
