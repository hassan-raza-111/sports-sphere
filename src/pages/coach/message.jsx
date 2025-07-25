import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../../config.js';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import CoachLayout from '../../components/Layout';
import logo from '../../assets/images/Logo.png';

const messagesStyles = `
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
    justify-content: space-between;
  }

  .new-message-btn {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s;
  }

  .new-message-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
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
    background-color: #e74c3c;
    color: white;
  }

  .conversation-item.active .conversation-name,
  .conversation-item.active .conversation-preview {
    color: white;
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
    background-color: #3498db;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
    box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
  }

  .chat-container {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    border-left: 4px solid #e74c3c;
  }

  .chat-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e1e5eb;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: white;
  }

  .chat-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #e74c3c;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .chat-user-info {
    flex: 1;
  }

  .chat-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
  }

  .chat-status {
    font-size: 0.9rem;
    color: #7f8c8d;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    background-color: #27ae60;
    border-radius: 50%;
  }

  .chat-messages {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    background: #f8f9fa;
    max-height: 400px;
  }

  .message {
    margin-bottom: 1rem;
    max-width: 70%;
    word-wrap: break-word;
  }

  .message-received {
    align-self: flex-start;
    background-color: white;
    color: #2c3e50;
    border: 1px solid #e1e5eb;
    border-radius: 15px;
    border-bottom-left-radius: 5px;
    padding: 0.8rem 1rem;
  }

  .message-sent {
    align-self: flex-end;
    background-color: #e74c3c;
    color: white;
    border-radius: 15px;
    border-bottom-right-radius: 5px;
    padding: 0.8rem 1rem;
    margin-left: auto;
  }

  .message-time {
    font-size: 0.75rem;
    margin-top: 0.5rem;
    opacity: 0.7;
  }

  .message-received .message-time {
    text-align: left;
  }

  .message-sent .message-time {
    text-align: right;
  }

  .chat-input {
    padding: 1rem;
    border-top: 1px solid #e1e5eb;
    display: flex;
    gap: 0.8rem;
    background: white;
  }

  .chat-input input {
    flex: 1;
    padding: 0.8rem 1.2rem;
    border: 2px solid #e1e5eb;
    border-radius: 25px;
    font-size: 1rem;
    transition: all 0.3s;
    outline: none;
  }

  .chat-input input:focus {
    border-color: #e74c3c;
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

  .send-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }

  .no-conversation {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #7f8c8d;
    font-size: 1.1rem;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #7f8c8d;
  }

  .error {
    color: #e74c3c;
    text-align: center;
    padding: 1rem;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .modal-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #7f8c8d;
  }

  .user-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .user-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e1e5eb;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .user-item:hover {
    background-color: #f8f9fa;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e74c3c;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 1rem;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 8px 12px;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #bdc3c7;
    animation: typing 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(1) {
    animation-delay: -0.32s;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .connection-status {
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 0.8rem;
    z-index: 1000;
    transition: all 0.3s;
  }

  .connection-status.connected {
    background-color: #27ae60;
    color: white;
  }

  .connection-status.disconnected {
    background-color: #e74c3c;
    color: white;
  }

  .connection-status.error {
    background-color: #f39c12;
    color: white;
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
  }
`;

function Messages() {
  const navigate = useNavigate();
  const {
    socket,
    isConnected,
    connectionError,
    joinRoom,
    sendMessage: socketSendMessage,
  } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    fetchConversations(user._id);
  }, [navigate]);

  // Fetch available users when modal is opened
  useEffect(() => {
    if (showNewMessage && currentUser) {
      fetchAvailableUsers();
    }
  }, [showNewMessage, currentUser]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !currentUser) return;

    // Join user's room
    const userId = currentUser._id || currentUser.id;
    joinRoom(userId);

    // Listen for new messages
    socket.on('new_message', (data) => {
      console.log('New message received:', data);
      const { message } = data;

      // Check if this message is for the currently open conversation
      const isCurrentConversation =
        selectedConversation &&
        (message.sender === selectedConversation.partnerId ||
          message.receiver === selectedConversation.partnerId);

      if (isCurrentConversation) {
        // Add message to current conversation
        setMessages((prev) => [...prev, message]);
      } else {
        // Update unread count for the conversation
        setConversations((prev) =>
          prev.map((conv) => {
            if (
              conv.partnerId === message.sender ||
              conv.partnerId === message.receiver
            ) {
              return {
                ...conv,
                unreadCount: (conv.unreadCount || 0) + 1,
                lastMessage: message.content,
                lastMessageTime: message.timestamp,
              };
            }
            return conv;
          })
        );
      }

      // Update conversations list
      fetchConversations(userId);
    });

    // Listen for message sent confirmation
    socket.on('message_sent', (data) => {
      console.log('Message sent successfully:', data);
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
      }
    });

    // Listen for typing indicators
    socket.on('user_typing', (data) => {
      const { sender, isTyping } = data;
      if (isTyping) {
        setTypingUsers((prev) => new Set([...prev, sender]));
      } else {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(sender);
          return newSet;
        });
      }
    });

    // Listen for conversation updates
    socket.on('conversation_updated', (data) => {
      console.log('Conversation updated:', data);
      const userId = currentUser._id || currentUser.id;
      fetchConversations(userId);
    });

    return () => {
      socket.off('new_message');
      socket.off('message_sent');
      socket.off('user_typing');
      socket.off('conversation_updated');
    };
  }, [socket, currentUser, selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/messages/conversations/${userId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/users/${currentUser._id}/${currentUser.role}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setAvailableUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchMessages = async (senderId, receiverId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/${senderId}/${receiverId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    try {
      const userId = currentUser._id || currentUser.id;
      const messageData = {
        sender: userId,
        receiver: selectedConversation.partnerId,
        content: newMessage.trim(),
      };

      // Only send via socket for real-time
      socketSendMessage(messageData);
      setNewMessage('');

      // Update conversations list after a short delay
      setTimeout(() => {
        fetchConversations(userId);
      }, 500);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const handleConversationSelect = async (conversation) => {
    setSelectedConversation(conversation);

    // Clear unread count for this conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv.partnerId === conversation.partnerId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );

    if (currentUser) {
      fetchMessages(currentUser._id, conversation.partnerId);

      // Mark messages as read
      try {
        await fetch(
          `${API_BASE_URL}/messages/mark-read/${currentUser._id}/${conversation.partnerId}`,
          {
            method: 'PUT',
          }
        );
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    }
  };

  const startNewConversation = async (userId) => {
    if (!currentUser) return;

    try {
      // Create a new conversation by sending an initial message
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: currentUser._id,
          receiver: userId,
          content: 'Hello! I would like to start a conversation.',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      // Refresh conversations and select the new one
      await fetchConversations(currentUser._id);
      setShowNewMessage(false);

      // Find the new conversation and select it
      const newConversation = conversations.find(
        (conv) => conv.partnerId === userId
      );
      if (newConversation) {
        handleConversationSelect(newConversation);
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <CoachLayout>
      <style dangerouslySetInnerHTML={{ __html: messagesStyles }} />

      {/* Connection Status */}
      <div
        className={`connection-status ${
          isConnected ? 'connected' : connectionError ? 'error' : 'disconnected'
        }`}
      >
        {isConnected
          ? '🟢 Connected'
          : connectionError
          ? '⚠️ Backend Offline'
          : '🔴 Disconnected'}
      </div>

      <main className='messages-container'>
        <div className='conversation-list'>
          <div className='conversation-header'>
            <div>
              <i className='fas fa-comments'></i> Conversations
            </div>
            <button
              className='new-message-btn'
              onClick={() => setShowNewMessage(true)}
            >
              <i className='fas fa-plus'></i> New Message
            </button>
          </div>
          <div className='conversation-search'>
            <input type='text' placeholder='Search conversations...' />
          </div>
          <div className='conversation-items'>
            {loading ? (
              <div className='loading'>Loading conversations...</div>
            ) : error ? (
              <div className='error'>{error}</div>
            ) : conversations.length === 0 ? (
              <div className='no-conversation'>No conversations yet</div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.partnerId}
                  className={`conversation-item ${
                    selectedConversation?.partnerId === conversation.partnerId
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div className='conversation-avatar'>
                    {conversation.partnerImage ? (
                      <img
                        src={conversation.partnerImage}
                        alt={conversation.partnerName}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      getInitials(conversation.partnerName)
                    )}
                  </div>
                  <div className='conversation-info'>
                    <div className='conversation-name'>
                      {conversation.partnerName}
                      <span className='conversation-time'>
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <div className='conversation-preview'>
                      {conversation.lastMessage}
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className='unread-badge'>
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className='chat-container'>
          {selectedConversation ? (
            <>
              <div className='chat-header'>
                <div className='chat-avatar'>
                  {selectedConversation.partnerImage ? (
                    <img
                      src={selectedConversation.partnerImage}
                      alt={selectedConversation.partnerName}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    getInitials(selectedConversation.partnerName)
                  )}
                </div>
                <div className='chat-user-info'>
                  <div className='chat-name'>
                    {selectedConversation.partnerName}
                  </div>
                  <div className='chat-status'>
                    <span className='status-indicator'></span>{' '}
                    {selectedConversation.partnerRole}
                  </div>
                </div>
              </div>

              <div className='chat-messages'>
                {messages.map((message) => {
                  const userId = currentUser._id || currentUser.id;
                  return (
                    <div
                      key={message._id}
                      className={`message ${
                        message.sender === userId
                          ? 'message-sent'
                          : 'message-received'
                      }`}
                    >
                      {message.content}
                      <div className='message-time'>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {typingUsers.has(selectedConversation.partnerId) && (
                  <div className='message message-received'>
                    <div className='typing-indicator'>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}

                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              <div className='chat-input'>
                <input
                  type='text'
                  placeholder='Type your message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  className='send-btn'
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                >
                  <i className='fas fa-paper-plane'></i>
                </button>
              </div>
            </>
          ) : (
            <div className='no-conversation'>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </main>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className='modal-overlay' onClick={() => setShowNewMessage(false)}>
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <div className='modal-title'>Start New Conversation</div>
              <button
                className='close-btn'
                onClick={() => setShowNewMessage(false)}
              >
                ×
              </button>
            </div>
            <div className='user-list'>
              {availableUsers.map((user) => (
                <div
                  key={user._id}
                  className='user-item'
                  onClick={() => startNewConversation(user._id)}
                >
                  <div className='user-avatar'>
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                      {user.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CoachLayout>
  );
}

export default Messages;
