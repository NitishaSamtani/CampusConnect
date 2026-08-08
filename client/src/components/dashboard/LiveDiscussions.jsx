import "../../pages/user/Dashboard/Dashboard.css";

function LiveDiscussions({ discussions }) {
  return (
    <div className="live-discussions">

      <h2>Live Discussions</h2>

      {discussions?.length === 0 ? (
        <p>No discussions yet</p>
      ) : (
        discussions.map((discussion, index) => (
          <div
            key={index}
            className="discussion-card"
          >

            <div className="discussion-avatar">
              {discussion.userId?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div className="discussion-content">

              <h4>
                {discussion.userId?.name}
              </h4>

              <p>
                {discussion.message}
              </p>

            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default LiveDiscussions;