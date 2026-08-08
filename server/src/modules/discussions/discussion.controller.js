const discussionService = require("./discussion.service");

/**
 * GET /api/discussions/rooms
 */
const getAllRooms = async (req, res) => {
  try {
    const rooms = await discussionService.getAllRooms();

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get Rooms Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch discussion rooms.",
    });
  }
};

/**
 * GET /api/discussions/:roomId
 */
const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await discussionService.getRoomById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Discussion room not found.",
      });
    }

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch room.",
    });
  }
};

/**
 * GET /api/discussions/:roomId/messages
 */
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await discussionService.getRoomMessages(roomId);

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
    });
  }
};

/**
 * POST /api/discussions/create-room
 */
const createRoom = async (req, res) => {
  try {
    const {
      company,
      role,
      roomName,
      description,
    } = req.body;

    if (!company || !role || !roomName) {
      return res.status(400).json({
        success: false,
        message: "Company, role and room name are required.",
      });
    }

    const room = await discussionService.createRoom({
      company,
      role,
      roomName,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Discussion room created successfully.",
      room,
    });
  } catch (error) {
    console.error("Create Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create room.",
    });
  }
};

const getRoomByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    const room =
      await discussionService.getRoomByRoleId(
        roleId
      );

    if (!room) {
      return res.status(404).json({
        success: false,
        message:
          "Discussion room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * POST /api/discussions/:roomId/join
 */
const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    //const userId = req.user.id;
    const userId = req.user.userId;

    const room = await discussionService.joinRoom(roomId, userId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Discussion room not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Joined room successfully.",
      room,
    });
  } catch (error) {
    console.error("Join Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to join room.",
    });
  }
};

/**
 * POST /api/discussions/:roomId/leave
 */
const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const userId = req.user.userId;

    const room = await discussionService.leaveRoom(roomId, userId);

    return res.status(200).json({
      success: true,
      message: "Left room successfully.",
      room,
    });
  } catch (error) {
    console.error("Leave Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to leave room.",
    });
  }
};

/**
 * DELETE /api/discussions/:roomId
 */
const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await discussionService.deleteRoom(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Discussion room not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Discussion room deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete room.",
    });
  }
};

module.exports = {
  getAllRooms,
  getRoom,
   getRoomByRole,
  getMessages,
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
};