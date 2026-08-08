const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


/*
========================================
GET PROFILE
========================================
*/

export const getProfile = async () => {

  const response =
    await fetch(
      `${API_URL}/profile`,
      {
        method: "GET",

        credentials: "include",

        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data.message ||
        "Failed to fetch profile"
    );

  }


  return data;
};


/*
========================================
UPDATE PROFILE
========================================
*/

export const updateProfile =
  async (profileData) => {

    const response =
      await fetch(
        `${API_URL}/profile`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              profileData
            ),
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
          "Failed to update profile"
      );

    }


    return data;
  };


/*
========================================
MY EXPERIENCES
========================================
*/

export const getMyExperiences =
  async () => {

    const response =
      await fetch(
        `${API_URL}/profile/experiences`,
        {
          method: "GET",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
          "Failed to fetch experiences"
      );

    }


    return data;
  };


/*
========================================
MY COMMENTS
========================================
*/

export const getMyComments =
  async () => {

    const response =
      await fetch(
        `${API_URL}/profile/comments`,
        {
          method: "GET",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
          "Failed to fetch comments"
      );

    }


    return data;
  };


/*
========================================
MY ACTIVITY
========================================
*/

export const getMyActivity =
  async () => {

    const response =
      await fetch(
        `${API_URL}/profile/activity`,
        {
          method: "GET",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
          "Failed to fetch activity"
      );

    }


    return data;
  };