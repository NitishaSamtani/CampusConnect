import { useParams } from "react-router-dom";

const DiscussionChat = () => {

  const { roomId } = useParams();

  return (
    <div style={{ padding: "40px" }}>

      <h1>
        Discussion Room
      </h1>

      <p>
        Room ID: {roomId}
      </p>

    </div>
  );

};

export default DiscussionChat;