const mongoose = require("mongoose");

const commentSchema =
  new mongoose.Schema(
    {
      experienceId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Experience",
        required: true,
      },

      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Comment",
    commentSchema
  );