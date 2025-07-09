import { useState, useCallback } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Document Added",
    message: "A new document 'Q2 Financial Report' has been added to the Finance department.",
    time: "Just now",
    read: false
  },
  {
    id: "2",
    title: "Document Updated",
    message: "The document 'Employee Handbook' has been updated with new content.",
    time: "2 hours ago",
    read: false
  },
  {
    id: "3",
    title: "Processing Complete",
    message: "Document 'Customer Survey Results' has been processed successfully.",
    time: "5 hours ago",
    read: false
  },
  {
    id: "4",
    title: "New User Joined",
    message: "John Doe has joined the platform and has been assigned to the Marketing department.",
    time: "Yesterday",
    read: true
  },
  {
    id: "5",
    title: "System Update",
    message: "The system will undergo maintenance on July 15th. Please save your work before 11:00 PM.",
    time: "2 days ago",
    read: true
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
  };
};
