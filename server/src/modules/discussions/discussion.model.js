const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    /*
    ========================================
    Role Reference
    ========================================
    */

  roleId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Role",
  required: true,
  unique: true,
},
    /*
    ========================================
    Company / Role Information
    ========================================
    */

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    roomName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /*
    ========================================
    Participants
    ========================================
    */

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /*
    ========================================
    Online Users
    ========================================
    */

    onlineUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /*
    ========================================
    Last Message
    ========================================
    */

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    totalMessages: {
      type: Number,
      default: 0,
    },

    /*
    ========================================
    Status
    ========================================
    */

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
========================================
Indexes
========================================
*/

discussionSchema.index({
  company: 1,
  role: 1,
});

module.exports = mongoose.model(
  "DiscussionRoom",
  discussionSchema
);