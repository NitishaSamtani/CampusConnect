const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


/*
========================================
Get Notifications
========================================
*/

export const getNotifications =
  async () => {

    const response =
      await fetch(
        `${API_URL}/notifications`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
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
Mark Read
========================================
*/

export const markNotificationAsRead =
  async (notificationId) => {

    const response =
      await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Failed to mark notification"
      );
    }

    return data;
  };


/*
========================================
Mark All Read
========================================
*/

export const markAllNotificationsAsRead =
  async () => {

    const response =
      await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Failed to mark notifications"
      );
    }

    return data;
  };