import { Notification } from '../types';

// Mock notification storage
let notifications: Notification[] = [
  {
    id: '1',
    userId: 'admin',
    title: 'New Application Submitted',
    message: 'A new land registration application has been submitted by John Doe.',
    type: 'info',
    read: false,
    timestamp: new Date().toISOString(),
    link: '/admin/registrations'
  },
  {
    id: '2',
    userId: 'admin',
    title: 'Application Status Updated',
    message: 'The application for Jane Smith has been approved.',
    type: 'success',
    read: true,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    link: '/admin/registrations'
  }
];

export const NotificationService = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    // In a real app, this would be an API call
    return notifications.filter(n => n.userId === userId || n.userId === 'all');
  },

  markAsRead: async (id: string): Promise<void> => {
    notifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    notifications = notifications.map(n => 
      (n.userId === userId || n.userId === 'all') ? { ...n, read: true } : n
    );
  },

  addNotification: async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications = [newNotification, ...notifications];
  }
};
