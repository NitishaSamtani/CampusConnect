import axios from "axios";

const API =
  "http://localhost:5000/api/comments";

export const addComment =
  async (data) => {
    const response =
      await axios.post(
        API,
        data,
        {
          withCredentials: true,
        }
      );

    return response.data;
  };

export const getComments =
  async (
    experienceId
  ) => {
    const response =
      await axios.get(
        `${API}/${experienceId}`
      );

    return response.data;
  };
export const deleteComment =
  async (commentId) => {
    const response =
      await axios.delete(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          withCredentials: true,
        }
      );

    return response.data;
  };