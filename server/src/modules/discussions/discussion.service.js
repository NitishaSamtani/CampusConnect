const DiscussionRoom = require("./discussion.model");
const Message = require("./message.model");


/*
========================================
Get All Active Discussion Rooms
========================================
*/

const getAllRooms = async () => {

  return await DiscussionRoom.find({
    isActive: true,
  }).sort({
    company: 1,
    role: 1,
  });

};


/*
========================================
Get Room By ID
========================================
*/

const getRoomById = async (roomId) => {

  return await DiscussionRoom.findById(roomId)
    .populate(
      "participants",
      "name email college branch"
    )
    .populate(
      "onlineUsers",
      "name email college branch"
    );
};

/*
========================================
Get Room By Role ID
========================================
*/

const getRoomByRoleId = async (roleId) => {

  return await DiscussionRoom.findOne({
    roleId,
    isActive: true,
  });

};


/*
========================================
Create Discussion Room
========================================
*/

const createRoom = async (roomData) => {

  return await DiscussionRoom.create(
    roomData
  );

};


/*
========================================
Add Participant
========================================
*/

const joinRoom = async (
  roomId,
  userId
) => {

  return await DiscussionRoom.findByIdAndUpdate(
    roomId,
    {
      $addToSet: {
        participants: userId,
      },
    },
    {
      new: true,
    }
  );

};


/*
========================================
Remove Participant
========================================
*/

const leaveRoom = async (
  roomId,
  userId
) => {

  return await DiscussionRoom.findByIdAndUpdate(
    roomId,
    {
      $pull: {
        participants: userId,
        onlineUsers: userId,
      },
    },
    {
      new: true,
    }
  );

};


/*
========================================
Mark User Online
========================================
*/

const userOnline = async (
  roomId,
  userId
) => {

  return await DiscussionRoom.findByIdAndUpdate(
    roomId,
    {
      $addToSet: {
        onlineUsers: userId,
      },
    },
    {
      new: true,
    }
  );

};


/*
========================================
Mark User Offline
========================================
*/

const userOffline = async (
  roomId,
  userId
) => {

  return await DiscussionRoom.findByIdAndUpdate(
    roomId,
    {
      $pull: {
        onlineUsers: userId,
      },
    },
    {
      new: true,
    }
  );

};


/*
========================================
Save Chat Message
========================================
*/

const saveMessage = async ({
  roomId,
  sender,
  senderName,
  message,
}) => {

  const newMessage =
    await Message.create({

      roomId,

      sender,

      senderName,

      message,

    });


  /*
  --------------------------------------
  Update Room Message Information
  --------------------------------------
  */

  await DiscussionRoom.findByIdAndUpdate(
    roomId,
    {
      lastMessage: message,

      lastMessageAt:
        new Date(),

      $inc: {
        totalMessages: 1,
      },
    }
  );


  return newMessage;

};


/*
========================================
Get Room Messages
========================================
*/

const getRoomMessages = async (
  roomId
) => {

  return await Message.find({
    roomId,

    deleted: false,

  }).sort({
    createdAt: 1,
  });

};


/*
========================================
Delete Discussion Room
========================================
*/

const deleteRoom = async (
  roomId
) => {

  /*
  --------------------------------------
  Delete messages first
  --------------------------------------
  */

  await Message.deleteMany({
    roomId,
  });


  /*
  --------------------------------------
  Delete room
  --------------------------------------
  */

  return await DiscussionRoom.findByIdAndDelete(
    roomId
  );

};


/*
========================================
Exports
========================================
*/

module.exports = {

  getAllRooms,

  getRoomById,

  getRoomByRoleId,

  createRoom,

  joinRoom,

  leaveRoom,

  userOnline,

  userOffline,

  saveMessage,

  getRoomMessages,

  deleteRoom,

};