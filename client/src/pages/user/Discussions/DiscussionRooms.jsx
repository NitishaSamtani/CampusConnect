import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  RefreshCw,
  Users,
} from "lucide-react";

import RoomCard from "../../../components/discussions/RoomCard";

import {
  getDiscussionRooms,
  joinDiscussionRoom,
} from "../../../services/discussionApi";

import "./DiscussionRooms.css";

const DiscussionRooms = () => {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [joiningRoomId, setJoiningRoomId] =
    useState(null);

  /*
  ========================================
  Fetch Rooms
  ========================================
  */

  const fetchRooms = async () => {

    try {

      setLoading(true);

      setError("");

      const data =
        await getDiscussionRooms();

      setRooms(data.rooms || []);

    } catch (error) {

      console.error(
        "Discussion Rooms Error:",
        error
      );

      setError(
        error.message ||
        "Unable to load discussion rooms."
      );

    } finally {

      setLoading(false);

    }

  };

  /*
  ========================================
  Initial Load
  ========================================
  */

  useEffect(() => {

    fetchRooms();

  }, []);

  /*
  ========================================
  Join Room
  ========================================
  */

  const handleJoinRoom = async (roomId) => {

    try {

      setJoiningRoomId(roomId);

      await joinDiscussionRoom(roomId);

      navigate(
        `/discussions/${roomId}`
      );

    } catch (error) {

      console.error(
        "Join Room Error:",
        error
      );

      setError(
        error.message ||
        "Unable to join discussion room."
      );

    } finally {

      setJoiningRoomId(null);

    }

  };

  /*
  ========================================
  Loading State
  ========================================
  */

  if (loading) {

    return (
      <div className="discussion-page">

        <div className="discussion-loading">

          <div className="discussion-spinner"></div>

          <p>
            Loading discussion rooms...
          </p>

        </div>

      </div>
    );

  }

  return (
    <div className="discussion-page">

      {/* =================================
          Header
      ================================= */}

      <section className="discussion-header">

        <div className="discussion-header-icon">
          <MessageCircle size={28} />
        </div>

        <div>

          <h1>
            Discussion Rooms
          </h1>

          <p>
            Connect with students preparing
            for the same companies and roles.
          </p>

        </div>

      </section>


      {/* =================================
          Error
      ================================= */}

      {error && (

        <div className="discussion-error">

          <p>
            {error}
          </p>

          <button
            onClick={fetchRooms}
          >
            <RefreshCw size={16} />

            Retry
          </button>

        </div>

      )}


      {/* =================================
          Room Statistics
      ================================= */}

      <div className="discussion-stats">

        <div className="discussion-stat-card">

          <div className="stat-icon">
            <MessageCircle size={21} />
          </div>

          <div>

            <strong>
              {rooms.length}
            </strong>

            <span>
              Discussion Rooms
            </span>

          </div>

        </div>


        <div className="discussion-stat-card">

          <div className="stat-icon">
            <Users size={21} />
          </div>

          <div>

            <strong>
              {rooms.reduce(
                (total, room) =>
                  total +
                  (room.participants?.length || 0),
                0
              )}
            </strong>

            <span>
              Members
            </span>

          </div>

        </div>

      </div>


      {/* =================================
          Rooms
      ================================= */}

      {rooms.length === 0 ? (

        <div className="discussion-empty">

          <div className="empty-icon">
            <MessageCircle size={32} />
          </div>

          <h2>
            No discussion rooms yet
          </h2>

          <p>
            Discussion rooms will appear here
            once they are created.
          </p>

        </div>

      ) : (

        <section className="discussion-room-grid">

          {rooms.map((room) => (

            <RoomCard
              key={room._id}
              room={room}
              onJoin={handleJoinRoom}
              joining={
                joiningRoomId === room._id
              }
            />

          ))}

        </section>

      )}

    </div>
  );
};

export default DiscussionRooms;