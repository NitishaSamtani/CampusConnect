const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


/*
========================================
GET ALL NOTIFICATIONS
========================================
*/

export const getNotifications = async () => {

  const response = await fetch(
    `${API_URL}/notifications`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Failed to fetch notifications"
    );

  }

  return data;
};


/*
========================================
GET UNREAD COUNT
========================================
*/

export const getUnreadCount = async () => {

  const response = await fetch(
    `${API_URL}/notifications/unread`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Failed to fetch unread count"
    );

  }

  return data;
};


/*
========================================
MARK ONE AS READ
========================================
*/

export const markNotificationAsRead =
  async (notificationId) => {

    const response = await fetch(
      `${API_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to mark notification as read"
      );

    }

    return data;
  };


/*
========================================
MARK ALL AS READ
========================================
*/

export const markAllNotificationsAsRead =
  async () => {

    const response = await fetch(
      `${API_URL}/notifications/read-all`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to mark notifications as read"
      );

    }

    return data;
  };