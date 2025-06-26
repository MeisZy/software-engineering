import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Sidebar.css';
import Placeholder from '../components/images/pfp_placeholder.png';
import Notification from './images/notification.png';

function HelpAdmin({ sections }) {
  const [selectedSection, setSelectedSection] = useState('section1');
    const [profilePic, setProfilePic] = useState('');
  
  const [userEmail, setUserEmail] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [applicationMessage, setApplicationMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/notifications/${localStorage.getItem('userEmail')}`);
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setApplicationMessage('Failed to load notifications.');
        setTimeout(() => setApplicationMessage(''), 3000);
      }
    };

    const storedEmail = localStorage.getItem('userEmail');
    const storedPic = localStorage.getItem('profilePic');
    if (storedEmail) {
      setUserEmail(storedEmail);
      setProfilePic(storedPic || '');
      fetchNotifications();
    } else {
      navigate('/');
    }
  }, [navigate]);

  
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {
        email: userEmail,
        fullName: localStorage.getItem('userName') || '',
        firstName: '',
        middleName: '',
      });
    } catch (err) {
      console.error('Error logging logout:', err);
    } finally {
      localStorage.removeItem('userName');
      localStorage.removeItem('profilePic');
      localStorage.removeItem('userEmail');
      navigate('/');
    }
  };

  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setApplicationMessage('Failed to mark notification as read.');
      setTimeout(() => setApplicationMessage(''), 3000);
    }
  };

  const textSections = {
    section1: {
      title: 'Frequently Asked Questions',
      body: (
        <>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is thefirst section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
        </>
      ),
    },
    section2: {
      title: 'User Guides',
      body: (
        <>
          <p>This section dives into more detail...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
        </>
      ),
    },
    section3: {
      title: 'Contact Information',
      body: (
        <>
          <p>React is a flexible...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
          <p>This is the first section...</p>
          <p>React makes it painless...</p>
        </>
      ),
    },
    section4: {
      title: 'User Roles',
      body: (
        <>
          <p>Q: What is React?</p>
          <p>A: A JavaScript library for building UIs.</p>
          <p>Q: Is it hard to learn?</p>
          <p>A: Not if you're familiar with JavaScript.</p>
        </>
      ),
    },
  };

  return (
    <div className="Main-Container">
      <nav className="user-nav">
        <div className="user-nav-left">
          <img
            src={profilePic || Placeholder}
          />
          <Link to="/adminhome">Home</Link>
        
          <Link to="/about">About</Link>
        </div>
        <div className="user-nav-right">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={Notification}
              alt="Notifications"
              className="notification-icon notification-button"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span
                className="notification-count"
                style={{ position: 'absolute', top: '-8px', right: '-8px' }}
              >
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </div>
          <Link to="/" onClick={handleLogout}>
            Logout
          </Link>
        </div>
      </nav>

      {showNotifications && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div
            className="notifications-container"
            onClick={() => setShowNotifications(false)}
          >
            <div className="notiflightGreenBG">
              <div
                className="notifications-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="notif-header">
                  <h2>Notifications</h2>
                  <button
                    onClick={() => setShowNotifications(false)}
                    style={{
                      fontSize: '30px',
                      marginRight: '19px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                    }}
                  >
                    ×
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="NoNotif">
                    <p>No notifications available.</p>
                  </div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {notifications.map((notification) => (
                      <li
                        key={notification._id}
                        style={{
                          padding: '8px',
                          borderBottom: '1px solid #ddd',
                          background: notification.isRead ? '#f4f4f4' : '#fff',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: notification.isRead ? 'normal' : 'bold',
                            }}
                          >
                            {notification.message}
                          </p>
                          <span style={{ fontSize: '12px', color: '#888' }}>
                            {new Date(notification.createdAt).toLocaleString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            style={{
                              background: '#A2E494',
                              color: '#13714C',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor: 'pointer',
                            }}
                          >
                            Mark as Read
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {applicationMessage && (
        <div
          style={{
            color: applicationMessage.includes('successfully') ? 'green' : 'red',
            padding: '16px',
          }}
        >
          {applicationMessage}
        </div>
      )}

      <div className="Main-Container">
        <Sidebar setSelectedSection={setSelectedSection} selectedSection={selectedSection} />
        <div className="content-box">
          <div className="text-header">
            <h2>{textSections[selectedSection].title}</h2>
          </div>
          <div className="text-body">{textSections[selectedSection].body}</div>
        </div>
      </div>
    </div>
  );
}

export default HelpAdmin;