import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/auth`;

axios.defaults.withCredentials = true;

/*
========================================
Register User
========================================
*/

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API}/register`,
    userData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

/*
========================================
Login User
========================================
*/

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API}/login`,
    userData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

/*
========================================
Get Profile
========================================
*/

export const getProfile = async () => {
  const response = await axios.get(
    `${API}/profile`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

/*
========================================
Logout
========================================
*/

export const logoutUser = async () => {
  const response = await axios.post(
    `${API}/logout`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};

/*
========================================
Google Login
========================================
*/

export const googleLogin = async (credential) => {
  const response = await axios.post(
    `${API}/google`,
    {
      credential,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};