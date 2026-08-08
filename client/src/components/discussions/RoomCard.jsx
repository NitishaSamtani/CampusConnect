import {
  Users,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const RoomCard = ({
  room,
  onJoin,
  joining,
}) => {
  const participantCount =
    room.participants?.length || 0;

  return (
    <div className="discussion-room-card">

      <div className="room-card-top">

        <div className="room-company-icon">
          {room.company
            ? room.company.charAt(0).toUpperCase()
            : "D"}
        </div>

        <div className="room-card-heading">

          <h3>
            {room.company}
          </h3>

          <p>
            {room.role}
          </p>

        </div>

      </div>

      <div className="room-card-content">

        <h2>
          {room.roomName}
        </h2>

        {room.description && (
          <p className="room-description">
            {room.description}
          </p>
        )}

      </div>

      <div className="room-card-info">

        <div className="room-info-item">
          <Users size={17} />

          <span>
            {participantCount}{" "}
            {participantCount === 1
              ? "Member"
              : "Members"}
          </span>
        </div>

        <div className="room-info-item">
          <MessageCircle size={17} />

          <span>
            {room.totalMessages || 0} Messages
          </span>
        </div>

      </div>

      <button
        className="join-room-button"
        onClick={() => onJoin(room._id)}
        disabled={joining}
      >
        {joining ? (
          "Joining..."
        ) : (
          <>
            Join Room
            <ArrowRight size={18} />
          </>
        )}
      </button>

    </div>
  );
};

export default RoomCard;