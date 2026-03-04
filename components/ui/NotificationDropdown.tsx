import React, { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Notification } from '../../types';
import { NotificationService } from '../../services/notificationService';
import { Link } from 'react-router-dom';

interface NotificationDropdownProps {
  userId: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const data = await NotificationService.getNotifications(userId);
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.read).length);
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAsRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead(userId);
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
            <div className="p-4 border-bottom border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-green-50/30' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 space-x-3">
                          <span className="text-[10px] text-gray-400">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                          {notification.link && (
                            <Link 
                              to={notification.link}
                              className="text-[10px] text-green-600 hover:underline flex items-center"
                              onClick={() => {
                                setIsOpen(false);
                                handleMarkAsRead(notification.id);
                              }}
                            >
                              View <ExternalLink className="h-2 w-2 ml-1" />
                            </Link>
                          )}
                        </div>
                      </div>
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 text-center border-t border-gray-100">
              <button className="text-xs text-gray-500 hover:text-gray-700">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
