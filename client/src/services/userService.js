import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export const getProfile = async () => {
  const response = await axios.get(
    `${API_URL}/users/profile`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axios.put(
    `${API_URL}/users/profile`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getMyExperiences = async () => {
  const response = await axios.get(
    `${API_URL}/users/profile/experiences`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getMyComments = async () => {
  const response = await axios.get(
    `${API_URL}/users/profile/comments`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};