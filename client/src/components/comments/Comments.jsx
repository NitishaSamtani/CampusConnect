import {
  useEffect,
  useState,
} from "react";

import {
  addComment,
  getComments,
  deleteComment,
} from "../../services/commentService";

import { useAuth } from "../../context/AuthContext";

import "./Comments.css";

function Comments({
  experienceId,
}) {
  const { user } =
    useAuth();

  const [message, setMessage] =
    useState("");

  const [comments, setComments] =
    useState([]);

  useEffect(() => {
    loadComments();
  }, [experienceId]);

  const loadComments =
    async () => {
      try {
        const data =
          await getComments(
            experienceId
          );

        setComments(
          data.comments || []
        );
      } catch (error) {
        console.log(error);
      }
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!message.trim())
        return;

      try {
        await addComment({
          experienceId,
          message,
        });

        setMessage("");

        loadComments();
      } catch (error) {
        console.log(error);
      }
    };

  const handleDelete =
    async (commentId) => {
      try {
        await deleteComment(
          commentId
        );

        loadComments();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="comments-wrapper">

      <form
        className="comment-form"
        onSubmit={handleSubmit}
      >

        <textarea
          className="comment-input"
          value={message}
          onChange={(e) => {
            setMessage(
              e.target.value
            );

            e.target.style.height =
              "auto";

            e.target.style.height =
              `${e.target.scrollHeight}px`;
          }}
          placeholder="Share your thoughts about this interview experience..."
        />

        <button
          type="submit"
          className="comment-btn"
        >
          Post Comment
        </button>

      </form>

      <div className="comments-list">

        {comments.length ===
        0 ? (
          <p className="no-comments">
            No comments yet.
            Start the discussion!
          </p>
        ) : (
          comments.map(
            (comment) => (
              <div
                key={comment._id}
                className="comment-card"
              >

                <div className="comment-header">

                  <div className="user-info">

                    <div className="avatar">
                      {comment.userId?.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>

                      <h4>
                        {
                          comment
                            .userId
                            ?.name
                        }
                      </h4>

                      <span>
                        {new Date(
                          comment.createdAt
                        ).toLocaleString()}
                      </span>

                    </div>

                  </div>

                  {user &&
                    user._id?.toString() ===
                      comment.userId?._id?.toString() && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            comment._id
                          )
                        }
                      >
                        🗑️
                      </button>
                    )}

                </div>

                <p className="comment-message">
                  {comment.message}
                </p>

              </div>
            )
          )
        )}

      </div>

    </div>
  );
}

export default Comments;