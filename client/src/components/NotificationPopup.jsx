import React, { useEffect, useState } from 'react';
import './NotificationPopup.css'; // We'll create this CSS file next

const NotificationPopup = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000); // Notification disappears after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="notification-popup" onClick={() => { setIsVisible(false); onClose(); }}>
      {message}
    </div>
  );
};

export default NotificationPopup;