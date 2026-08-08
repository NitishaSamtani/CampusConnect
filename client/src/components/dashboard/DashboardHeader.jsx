import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  CheckCheck,
  MessageCircle,
  X,
  CircleUserRound,
} from "lucide-react";

import socket from "../../socket/socket";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

import "../../pages/user/Dashboard/Dashboard.css";

function DashboardHeader() {
  const navigate = useNavigate();

  // ========================================
  // Notification State
  // ========================================

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [notificationLoading, setNotificationLoading] =
    useState(true);

  const notificationRef = useRef(null);

  // ========================================
  // Load Notifications
  // ========================================

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setNotificationLoading(true);

      const data = await getNotifications();

      setNotifications(
        data.notifications || []
      );

      setUnreadCount(
        data.unreadCount || 0
      );

    } catch (error) {
      console.error(
        "Notification Load Error:",
        error
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  // ========================================
  // Socket.IO Notifications
  // ========================================

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewNotification =
      (notification) => {

        console.log(
          "🔔 New Notification:",
          notification
        );

        setNotifications((previous) => {

          const alreadyExists =
            previous.some(
              (item) =>
                item._id ===
                notification._id
            );

          if (alreadyExists) {
            return previous;
          }

          return [
            notification,
            ...previous,
          ];
        });

        setUnreadCount(
          (previous) =>
            previous + 1
        );
      };

    socket.on(
      "new-notification",
      handleNewNotification
    );

    return () => {
      socket.off(
        "new-notification",
        handleNewNotification
      );
    };
  }, []);

  // ========================================
  // Close Notification Dropdown
  // ========================================

  useEffect(() => {
    const handleClickOutside =
      (event) => {

        if (
          notificationRef.current &&
          !notificationRef.current.contains(
            event.target
          )
        ) {
          setNotificationOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ========================================
  // Mark Notification As Read
  // ========================================

  const handleNotificationClick =
    async (notification) => {

      try {

        if (!notification.isRead) {

          await markNotificationAsRead(
            notification._id
          );

          setNotifications(
            (previous) =>
              previous.map(
                (item) =>
                  item._id ===
                  notification._id
                    ? {
                        ...item,
                        isRead: true,
                      }
                    : item
              )
          );

          setUnreadCount(
            (previous) =>
              Math.max(
                0,
                previous - 1
              )
          );
        }

        // Navigate to related experience

        if (
          notification.relatedType ===
            "Experience" &&
          notification.relatedId
        ) {

          navigate(
            `/experiences/${notification.relatedId}`
          );

          setNotificationOpen(false);
        }

      } catch (error) {

        console.error(
          "Mark Notification Error:",
          error
        );

      }
    };

  // ========================================
  // Mark All Notifications As Read
  // ========================================

  const handleMarkAllRead =
    async () => {

      try {

        await markAllNotificationsAsRead();

        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                isRead: true,
              })
            )
        );

        setUnreadCount(0);

      } catch (error) {

        console.error(
          "Mark All Read Error:",
          error
        );

      }
    };

  // ========================================
  // Format Notification Time
  // ========================================

  const formatNotificationTime =
    (date) => {

      if (!date) {
        return "";
      }

      const notificationDate =
        new Date(date);

      const now =
        new Date();

      const difference =
        now - notificationDate;

      const seconds =
        Math.floor(
          difference / 1000
        );

      const minutes =
        Math.floor(
          seconds / 60
        );

      const hours =
        Math.floor(
          minutes / 60
        );

      const days =
        Math.floor(
          hours / 24
        );

      if (seconds < 60) {
        return "Just now";
      }

      if (minutes < 60) {
        return `${minutes}m ago`;
      }

      if (hours < 24) {
        return `${hours}h ago`;
      }

      if (days < 7) {
        return `${days}d ago`;
      }

      return notificationDate.toLocaleDateString(
        [],
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    };

  // ========================================
  // Notification Icon
  // ========================================

  const getNotificationIcon =
    (type) => {

      switch (type) {

        case "COMMENT":

          return (
            <MessageCircle
              size={18}
            />
          );

        default:

          return (
            <Bell size={18} />
          );
      }
    };

  // ========================================
  // Remove Notification
  // ========================================

  const handleRemoveNotification =
    (event, notificationId) => {

      event.stopPropagation();

      setNotifications(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              notificationId
          )
      );
    };

  // ========================================
  // UI
  // ========================================

  return (
    <header className="dashboard-header">

      {/* ==================================
          Logo
      ================================== */}

      <Link
        to="/dashboard"
        className="dashboard-logo"
      >
        CampusConnect
      </Link>


      {/* ==================================
          Navigation
      ================================== */}

      <nav className="dashboard-nav">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/companies">
          Companies
        </Link>

        <Link to="/experiences">
          Experiences
        </Link>

        <Link to="/experiences/create">
          Create Experience
        </Link>

      </nav>


      {/* ==================================
          RIGHT SIDE ACTIONS
      ================================== */}

      <div className="dashboard-actions">

        {/* ==================================
            Notification
        ================================== */}

        <div
          className="notification-wrapper"
          ref={notificationRef}
        >

          <button
            className="notification-button"
            onClick={() =>
              setNotificationOpen(
                (previous) =>
                  !previous
              )
            }
            aria-label="Notifications"
          >

            <Bell size={22} />

            {unreadCount > 0 && (
              <span className="notification-badge">

                {unreadCount > 99
                  ? "99+"
                  : unreadCount}

              </span>
            )}

          </button>


          {/* ==================================
              Notification Dropdown
          ================================== */}

          {notificationOpen && (

            <div className="notification-dropdown">

              {/* Header */}

              <div className="notification-header">

                <div>

                  <h3>
                    Notifications
                  </h3>

                  <span>
                    {unreadCount} unread
                  </span>

                </div>

                {unreadCount > 0 && (

                  <button
                    className="mark-all-button"
                    onClick={
                      handleMarkAllRead
                    }
                  >

                    <CheckCheck
                      size={16}
                    />

                    Mark all read

                  </button>

                )}

              </div>


              {/* Loading */}

              {notificationLoading ? (

                <div className="notification-empty">

                  <p>
                    Loading notifications...
                  </p>

                </div>

              ) : notifications.length === 0 ? (

                /* Empty */

                <div className="notification-empty">

                  <Bell size={30} />

                  <h4>
                    No notifications
                  </h4>

                  <p>
                    You're all caught up!
                  </p>

                </div>

              ) : (

                /* Notification List */

                <div className="notification-list">

                  {notifications.map(
                    (notification) => (

                      <div
                        key={
                          notification._id
                        }
                        className={`notification-item ${
                          notification.isRead
                            ? ""
                            : "unread"
                        }`}
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                      >

                        <div className="notification-icon">

                          {getNotificationIcon(
                            notification.type
                          )}

                        </div>


                        <div className="notification-content">

                          <div className="notification-title-row">

                            <strong>
                              {
                                notification.title
                              }
                            </strong>

                            {!notification.isRead && (
                              <span className="unread-dot" />
                            )}

                          </div>


                          <p>
                            {
                              notification.message
                            }
                          </p>


                          <span className="notification-time">

                            {formatNotificationTime(
                              notification.createdAt
                            )}

                          </span>

                        </div>


                        <button
                          className="notification-close"
                          onClick={(event) =>
                            handleRemoveNotification(
                              event,
                              notification._id
                            )
                          }
                          aria-label="Remove notification"
                        >

                          <X size={14} />

                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          )}

        </div>


        {/* ==================================
            PROFILE BUTTON
        ================================== */}

        <button
  className="dashboard-icon-btn profile-icon-btn"
  onClick={() => navigate("/profile")}
  aria-label="Profile"
  title="Profile"
>
  <CircleUserRound size={24} strokeWidth={1.8} />
</button>

      </div>

    </header>
  );
}

export default DashboardHeader;