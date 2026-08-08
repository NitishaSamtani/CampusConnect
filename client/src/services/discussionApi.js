

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/*
========================================
Get All Discussion Rooms
========================================
*/
export const getDiscussionRoomByRole = async (roleId) => {
  const response = await fetch(
    `${API_URL}/discussions/role/${roleId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch discussion room"
    );
  }

  return data;
};

export const getDiscussionRooms = async () => {
  const response = await fetch(
    `${API_URL}/discussions/rooms`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch discussion rooms"
    );
  }

  return data;
};

/*
========================================
Get Single Discussion Room
========================================
*/

export const getDiscussionRoom = async (roomId) => {
  const response = await fetch(
    `${API_URL}/discussions/${roomId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch discussion room"
    );
  }

  return data;
};

/*
========================================
Join Discussion Room
========================================
*/

export const joinDiscussionRoom = async (roomId) => {
  const response = await fetch(
    `${API_URL}/discussions/${roomId}/join`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to join discussion room"
    );
  }

  return data;
};

/*
========================================
Leave Discussion Room
========================================
*/

export const leaveDiscussionRoom = async (roomId) => {
  const response = await fetch(
    `${API_URL}/discussions/${roomId}/leave`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to leave discussion room"
    );
  }

  return data;
};

/*
========================================
Get Room Messages
========================================
*/

export const getDiscussionMessages = async (roomId) => {
  const response = await fetch(
    `${API_URL}/discussions/${roomId}/messages`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch messages"
    );
  }

  return data;
};