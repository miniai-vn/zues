"use client";
import { axiosInstance } from "@/configs";
import { ApiResponse } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useToast } from "../use-toast";

export enum NotificationType {
  ORDER = "order",
  MESSAGE = "message",
  SYSTEM = "system",
  PROMOTION = "promotion",
  REMINDER = "reminder",
  ALERT = "alert",
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response type (what comes from backend)
export interface NotificationAPIResponse {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQueryParams {
  userId?: string;
  type?: NotificationType;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateNotificationDto {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, unknown>;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper function to convert API response to Notification interface
export const transformNotificationFromAPI = (
  apiNotification: NotificationAPIResponse
): Notification => {
  return {
    ...apiNotification,
    createdAt: new Date(apiNotification.createdAt),
    updatedAt: new Date(apiNotification.updatedAt),
    readAt: apiNotification.readAt
      ? new Date(apiNotification.readAt)
      : undefined,
  };
};

// Helper function to create a new notification for API
export const createNotificationPayload = (
  notification: Omit<
    Notification,
    "id" | "createdAt" | "updatedAt" | "isRead" | "readAt"
  >
): CreateNotificationDto => {
  return {
    userId: notification.userId,
    title: notification.title,
    body: notification.body,
    type: notification.type,
    data: notification.data,
  };
};

const useNotifications = ({
  userId,
  initialFilters = {},
}: {
  userId?: string;
  initialFilters?: Partial<NotificationQueryParams>;
} = {}) => {
  const { toast } = useToast();

  // Transform filters for API call
  const apiFilters = useCallback(() => {
    const params: any = {};

    if (userId) {
      params.userId = userId;
    }

    if (initialFilters.type) {
      params.type = initialFilters.type;
    }

    if (initialFilters.isRead !== undefined) {
      params.isRead = initialFilters.isRead;
    }

    if (initialFilters.limit) {
      params.limit = initialFilters.limit;
    }

    if (initialFilters.offset) {
      params.offset = initialFilters.offset;
    }

    return params;
  }, [userId, initialFilters]);

  // Get notifications with filters
  const {
    data: notificationsData,
    isFetching: isFetchingNotifications,
    refetch: refetchNotifications,
    error: fetchNotificationsError,
  } = useQuery({
    queryKey: ["notifications", userId, initialFilters],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/notifications", {
        params: apiFilters(),
      });

      // Transform API response to client format

      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });

  // Mark notification as read
  const { mutateAsync: markAsRead, isPending: isMarkingAsRead } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.patch<ApiResponse<Notification>>(
        `/api/notifications/${id}/mark-read`
      );
      return response.data;
    },
    onSuccess: () => {
      refetchNotifications();
      toast({
        title: "Notification marked as read",
        description: "The notification has been marked as read",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Failed to mark as read",
        description: "Could not mark the notification as read",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Mark all notifications as read
  const { mutateAsync: markAllAsRead, isPending: isMarkingAllAsRead } =
    useMutation({
      mutationFn: async () => {
        const response = await axiosInstance.patch<ApiResponse<void>>(
          "/api/notifications/mark-all-read",
          { userId }
        );
        return response.data;
      },
      onSuccess: () => {
        refetchNotifications();
        toast({
          title: "All notifications marked as read",
          description: "All your notifications have been marked as read",
          duration: 3000,
        });
      },
      onError: (error) => {
        console.error("Error marking all notifications as read:", error);
        toast({
          title: "Failed to mark all as read",
          description: "Could not mark all notifications as read",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  // Create new notification
  const { mutateAsync: createNotification, isPending: isCreatingNotification } =
    useMutation({
      mutationFn: async (notification: CreateNotificationDto) => {
        const response = await axiosInstance.post<ApiResponse<Notification>>(
          "/api/notifications",
          notification
        );
        return response.data;
      },
      onSuccess: () => {
        refetchNotifications();
        toast({
          title: "Notification created",
          description: "The notification has been created successfully",
          duration: 3000,
        });
      },
      onError: (error) => {
        console.error("Error creating notification:", error);
        toast({
          title: "Failed to create notification",
          description: "Could not create the notification",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  // Delete notification
  const { mutateAsync: deleteNotification, isPending: isDeletingNotification } =
    useMutation({
      mutationFn: async (id: string) => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
          `/api/notifications/${id}`
        );
        return response.data;
      },
      onSuccess: () => {
        refetchNotifications();
        toast({
          title: "Notification deleted",
          description: "The notification has been deleted successfully",
          duration: 3000,
        });
      },
      onError: (error) => {
        console.error("Error deleting notification:", error);
        toast({
          title: "Failed to delete notification",
          description: "Could not delete the notification",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  // Helper function to add a notification (wrapper for createNotification)
  const addNotification = useCallback(
    (
      notification: Omit<
        Notification,
        "id" | "createdAt" | "updatedAt" | "isRead" | "readAt"
      >
    ) => {
      const payload = createNotificationPayload(notification);
      return createNotification(payload);
    },
    [createNotification]
  );

  // Computed values
  const notifications = notificationsData || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  const isLoading = isFetchingNotifications;

  return {
    // Data
    notifications,
    unreadCount,

    // Loading states
    isLoading,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isCreatingNotification,
    isDeletingNotification,

    // Errors
    fetchNotificationsError,

    // Actions
    markAsRead,
    markAllAsRead,
    addNotification,
    createNotification,
    deleteNotification,
    refetchNotifications,

    // Filters (for future extension)
    filters: initialFilters,
  };
};

export { useNotifications };
