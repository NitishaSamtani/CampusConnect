import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Send,
  Users,
  Wifi,
  WifiOff,
  LogOut,
} from "lucide-react";

import socket from "../../../socket/socket";

import {
  getDiscussionRoom,
  getDiscussionMessages,
  joinDiscussionRoom,
  leaveDiscussionRoom,
} from "../../../services/discussionApi";

import {
  getProfile,
} from "../../../services/authService";

import "./DiscussionRoom.css";


const DiscussionRoom = () => {

  const { roomId } =
    useParams();

  const navigate =
    useNavigate();


  /*
  ========================================
  STATE
  ========================================
  */

  const [room, setRoom] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [currentUser, setCurrentUser] =
    useState(null);

  const [onlineUsers, setOnlineUsers] =
    useState(0);

  const [onlineMembers, setOnlineMembers] =
    useState([]);

  const [typingUser, setTypingUser] =
    useState(null);

  const [socketConnected, setSocketConnected] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [leaving, setLeaving] =
    useState(false);


  /*
  ========================================
  REFS
  ========================================
  */

  const messagesEndRef =
    useRef(null);

  const typingTimeout =
    useRef(null);


  /*
  ========================================
  LOAD DATA
  ========================================
  */

  useEffect(() => {

    if (!roomId) {
      return;
    }


    const loadData =
      async () => {

        try {

          setLoading(true);

          setError("");


          const [
            roomData,
            messageData,
            profileData,
          ] = await Promise.all([

            getDiscussionRoom(
              roomId
            ),

            getDiscussionMessages(
              roomId
            ),

            getProfile(),

          ]);


          setRoom(
            roomData.room
          );


          setMessages(
            messageData.messages ||
            []
          );


          setCurrentUser(
            profileData.user
          );


          /*
          --------------------------------
          Initial online users
          --------------------------------
          */

          const initialOnline =
            roomData.room?.onlineUsers ||
            [];


          setOnlineUsers(
            initialOnline.length
          );


          setOnlineMembers(
            initialOnline
          );


        } catch (error) {

          console.error(
            "❌ Load Discussion Error:",
            error
          );

          setError(
            "Unable to load discussion room."
          );

        } finally {

          setLoading(false);

        }

      };


    loadData();

  }, [roomId]);


  /*
  ========================================
  AUTO SCROLL
  ========================================
  */

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    messages,
    typingUser,
  ]);


  /*
  ========================================
  SOCKET
  ========================================
  */

  useEffect(() => {

    if (!roomId) {
      return;
    }


    /*
    --------------------------------------
    CONNECT
    --------------------------------------
    */

    const handleConnect =
      async () => {

        console.log(
          "🟢 Socket connected:",
          socket.id
        );


        setSocketConnected(true);


        /*
        ----------------------------------
        Add participant
        ----------------------------------
        */

        try {

          await joinDiscussionRoom(
            roomId
          );

        } catch (error) {

          console.error(
            "Join REST Error:",
            error
          );

        }


        /*
        ----------------------------------
        Join Socket.IO room
        ----------------------------------
        */

        socket.emit(
          "join-room",
          {
            roomId,
          }
        );

      };


    /*
    --------------------------------------
    CONNECTION ERROR
    --------------------------------------
    */

    const handleConnectError =
      (error) => {

        console.error(
          "Socket Connection Error:",
          error.message
        );

        setSocketConnected(false);

      };


    /*
    --------------------------------------
    DISCONNECT
    --------------------------------------
    */

    const handleDisconnect =
      (reason) => {

        console.log(
          "Socket disconnected:",
          reason
        );

        setSocketConnected(false);

        setOnlineUsers(0);

        setOnlineMembers([]);

      };


    /*
    --------------------------------------
    ONLINE MEMBERS
    --------------------------------------
    */

    const handleUserOnline =
      (data) => {

        console.log(
          "Online Members:",
          data
        );


        setOnlineUsers(
          data.onlineUsers || 0
        );


        setOnlineMembers(
          data.onlineMembers || []
        );

      };


    /*
    --------------------------------------
    RECEIVE MESSAGE
    --------------------------------------
    */

    const handleReceiveMessage =
      (newMessage) => {

        setMessages(
          (previousMessages) => {

            const exists =
              previousMessages.some(
                (msg) =>
                  msg._id ===
                  newMessage._id
              );


            if (exists) {
              return previousMessages;
            }


            return [
              ...previousMessages,
              newMessage,
            ];

          }
        );

      };


    /*
    --------------------------------------
    TYPING
    --------------------------------------
    */

    const handleTyping =
      (data) => {

        if (
          data.userId ===
          currentUser?._id
        ) {
          return;
        }


        setTypingUser(
          data.userName ||
          "Someone"
        );

      };


    /*
    --------------------------------------
    STOP TYPING
    --------------------------------------
    */

    const handleStopTyping =
      () => {

        setTypingUser(null);

      };


    /*
    --------------------------------------
    MESSAGE ERROR
    --------------------------------------
    */

    const handleMessageError =
      (data) => {

        alert(
          data?.message ||
          "Unable to send message."
        );

      };


    /*
    --------------------------------------
    REGISTER EVENTS
    --------------------------------------
    */

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "connect_error",
      handleConnectError
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "user-online",
      handleUserOnline
    );

    socket.on(
      "receive-message",
      handleReceiveMessage
    );

    socket.on(
      "typing",
      handleTyping
    );

    socket.on(
      "stop-typing",
      handleStopTyping
    );

    socket.on(
      "message-error",
      handleMessageError
    );


    /*
    --------------------------------------
    CONNECT
    --------------------------------------
    */

    socket.connect();


    /*
    --------------------------------------
    CLEANUP
    --------------------------------------
    */

    return () => {

      if (
        socket.connected
      ) {

        socket.emit(
          "stop-typing",
          {
            roomId,
          }
        );


        socket.emit(
          "leave-room",
          {
            roomId,
          }
        );

      }


      /*
      REST leave
      */

      leaveDiscussionRoom(
        roomId
      ).catch(
        (error) => {

          console.error(
            "Leave Error:",
            error
          );

        }
      );


      /*
      Remove listeners
      */

      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "connect_error",
        handleConnectError
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "user-online",
        handleUserOnline
      );

      socket.off(
        "receive-message",
        handleReceiveMessage
      );

      socket.off(
        "typing",
        handleTyping
      );

      socket.off(
        "stop-typing",
        handleStopTyping
      );

      socket.off(
        "message-error",
        handleMessageError
      );


      /*
      Disconnect
      */

      socket.disconnect();


      /*
      Clear timer
      */

      if (
        typingTimeout.current
      ) {

        clearTimeout(
          typingTimeout.current
        );

      }

    };

  }, [
    roomId,
    currentUser?._id,
  ]);


  /*
  ========================================
  SEND MESSAGE
  ========================================
  */

  const handleSendMessage =
    (e) => {

      e.preventDefault();


      const trimmed =
        message.trim();


      if (!trimmed) {
        return;
      }


      if (!socket.connected) {

        alert(
          "You are disconnected from the discussion."
        );

        return;

      }


      socket.emit(
        "send-message",
        {
          roomId,

          message:
            trimmed,
        }
      );


      setMessage("");


      socket.emit(
        "stop-typing",
        {
          roomId,
        }
      );

    };


  /*
  ========================================
  TYPING
  ========================================
  */

  const handleTyping =
    (e) => {

      const value =
        e.target.value;


      setMessage(value);


      if (
        typingTimeout.current
      ) {

        clearTimeout(
          typingTimeout.current
        );

      }


      if (
        !value.trim()
      ) {

        socket.emit(
          "stop-typing",
          {
            roomId,
          }
        );

        return;

      }


      socket.emit(
        "typing",
        {
          roomId,
        }
      );


      typingTimeout.current =
        setTimeout(
          () => {

            socket.emit(
              "stop-typing",
              {
                roomId,
              }
            );

          },
          1500
        );

    };


  /*
  ========================================
  LEAVE ROOM BUTTON
  ========================================
  */

  const handleLeaveRoom =
    async () => {

      if (leaving) {
        return;
      }


      try {

        setLeaving(true);


        /*
        ----------------------------------
        Socket leave
        ----------------------------------
        */

        if (
          socket.connected
        ) {

          socket.emit(
            "leave-room",
            {
              roomId,
            }
          );

        }


        /*
        ----------------------------------
        REST leave
        ----------------------------------
        */

        await leaveDiscussionRoom(
          roomId
        );


        /*
        ----------------------------------
        Disconnect
        ----------------------------------
        */

        socket.disconnect();


        /*
        ----------------------------------
        Navigate
        ----------------------------------
        */

        navigate(
          "/discussions"
        );

      } catch (error) {

        console.error(
          "Leave Room Error:",
          error
        );

        setLeaving(false);

      }

    };


  /*
  ========================================
  CHECK ONLINE
  ========================================
  */

  const isUserOnline =
    (userId) => {

      return onlineMembers.some(
        (member) =>
          String(member._id) ===
          String(userId)
      );

    };


  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {

    return (

      <div className="discussion-room-page loading-page">

        <div className="loader"></div>

        <p>
          Loading discussion room...
        </p>

      </div>

    );

  }


  /*
  ========================================
  ERROR
  ========================================
  */

  if (
    error ||
    !room
  ) {

    return (

      <div className="discussion-room-page error-page">

        <h2>
          {error ||
            "Discussion room not found."}
        </h2>

        <Link to="/discussions">
          Back to Discussions
        </Link>

      </div>

    );

  }


  /*
  ========================================
  CURRENT USER ID
  ========================================
  */

  const currentUserId =
    currentUser?._id;


  /*
  ========================================
  RENDER
  ========================================
  */

  return (

    <div className="discussion-room-page">


      {/* ==================================
          HEADER
      ================================== */}

      <header className="discussion-topbar">

        <div className="room-title-area">

          <Link
            to="/discussions"
            className="back-button"
          >
            <ArrowLeft size={18} />
          </Link>


          <div>

            <h1>
              {room.roomName}
            </h1>

            <p>
              {room.description}
            </p>

          </div>

        </div>


        <div className="room-actions">

          <div
            className={
              socketConnected
                ? "connection-status connected"
                : "connection-status disconnected"
            }
          >

            {
              socketConnected
                ? <Wifi size={16} />
                : <WifiOff size={16} />
            }

            <span>
              {
                socketConnected
                  ? "Connected"
                  : "Disconnected"
              }
            </span>

          </div>


          <button
            className="leave-button"
            onClick={
              handleLeaveRoom
            }
            disabled={leaving}
          >

            <LogOut size={17} />

            {
              leaving
                ? "Leaving..."
                : "Leave"
            }

          </button>

        </div>

      </header>


      {/* ==================================
          ROOM STATS
      ================================== */}

      <div className="room-stats">

        <div className="room-stat">

          <Users size={19} />

          <div>

            <strong>
              {
                room.participants
                  ?.length || 0
              }
            </strong>

            <span>
              Members
            </span>

          </div>

        </div>


        <div className="room-stat online-stat">

          <span className="online-dot"></span>

          <div>

            <strong>
              {onlineUsers}
            </strong>

            <span>
              Online
            </span>

          </div>

        </div>


        <div className="room-stat">

          <div>

            <strong>
              {
                room.totalMessages ||
                0
              }
            </strong>

            <span>
              Messages
            </span>

          </div>

        </div>

      </div>


      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <div className="discussion-layout">


        {/* =================================
            CHAT
        ================================= */}

        <main className="chat-area">


          {/* MESSAGES */}

          <div className="messages-container">

            {
              messages.length === 0 ? (

                <div className="empty-messages">

                  <div className="empty-message-icon">
                    💬
                  </div>

                  <h2>
                    No messages yet
                  </h2>

                  <p>
                    Start the conversation.
                  </p>

                </div>

              ) : (

                messages.map(
                  (msg, index) => {

                    const isMine =
                      String(
                        msg.sender
                      ) ===
                      String(
                        currentUserId
                      );


                    return (

                      <div
                        key={
                          msg._id ||
                          index
                        }
                        className={
                          isMine
                            ? "message-row mine"
                            : "message-row other"
                        }
                      >

                        <div className="message-bubble">

                          {
                            !isMine && (

                              <div className="message-author">

                                {
                                  msg.senderName ||
                                  "Student"
                                }

                              </div>

                            )
                          }


                          <div className="message-text">

                            {
                              msg.message
                            }

                          </div>


                          <div className="message-time">

                            {
                              msg.createdAt
                                ? new Date(
                                    msg.createdAt
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour:
                                        "2-digit",

                                      minute:
                                        "2-digit",
                                    }
                                  )
                                : ""
                            }

                          </div>

                        </div>

                      </div>

                    );

                  }
                )

              )
            }


            <div
              ref={
                messagesEndRef
              }
            />

          </div>


          {/* TYPING */}

          {
            typingUser && (

              <div className="typing-indicator">

                <span className="typing-dots">

                  <i></i>
                  <i></i>
                  <i></i>

                </span>

                <strong>
                  {typingUser}
                </strong>

                {" "}
                is typing...

              </div>

            )
          }


          {/* MESSAGE INPUT */}

          <form
            className="message-form"
            onSubmit={
              handleSendMessage
            }
          >

            <input
              type="text"
              value={message}
              onChange={
                handleTyping
              }
              placeholder={
                socketConnected
                  ? "Type a message..."
                  : "Connecting..."
              }
              disabled={
                !socketConnected
              }
            />


            <button
              type="submit"
              disabled={
                !message.trim() ||
                !socketConnected
              }
            >

              <Send size={18} />

              Send

            </button>

          </form>

        </main>


        {/* =================================
            MEMBERS SIDEBAR
        ================================= */}

        <aside className="members-sidebar">

          <div className="members-header">

            <div>

              <h2>
                Members
              </h2>

              <p>
                {
                  room.participants
                    ?.length || 0
                }{" "}
                total
              </p>

            </div>

            <Users size={20} />

          </div>


          <div className="members-list">

            {
              room.participants?.length
                ? room.participants.map(
                    (member) => {

                      const online =
                        isUserOnline(
                          member._id
                        );


                      const isCurrentUser =
                        String(
                          member._id
                        ) ===
                        String(
                          currentUserId
                        );


                      return (

                        <div
                          key={
                            member._id
                          }
                          className="member-item"
                        >

                          <div className="member-avatar">

                            {
                              member.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                              "S"
                            }

                          </div>


                          <div className="member-info">

                            <div className="member-name">

                              {
                                member.name ||
                                "Student"
                              }

                              {
                                isCurrentUser &&
                                (
                                  <span className="you-label">
                                    You
                                  </span>
                                )
                              }

                            </div>


                            <div
                              className={
                                online
                                  ? "member-status online"
                                  : "member-status offline"
                              }
                            >

                              <span className="status-dot"></span>

                              {
                                online
                                  ? "Online"
                                  : "Offline"
                              }

                            </div>

                          </div>

                        </div>

                      );

                    }
                  )
                : (

                  <div className="no-members">
                    No members yet.
                  </div>

                )
            }

          </div>

        </aside>

      </div>

    </div>

  );

};

export default DiscussionRoom;