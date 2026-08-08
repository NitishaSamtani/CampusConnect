const mongoose = require("mongoose");

/*
========================================
QUESTION SCHEMA
========================================
*/

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
  },

  questionType: {
    type: String,
    enum: [
      "APTITUDE",
      "CODING",
      "TECHNICAL",
      "HR",
    ],
    required: true,
  },

  difficulty: {
    type: String,
    enum: [
      "EASY",
      "MEDIUM",
      "HARD",
    ],
    default: "MEDIUM",
  },
});


/*
========================================
ROUND SCHEMA
========================================
*/

const roundSchema = new mongoose.Schema({
  roundName: {
    type: String,
    enum: [
      "OA",
      "TECHNICAL",
      "HR",
    ],
    required: true,
  },

  questions: [
    questionSchema,
  ],
});


/*
========================================
EXPERIENCE SCHEMA
========================================
*/

const experienceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    campusType: {
      type: String,
      enum: [
        "ON_CAMPUS",
        "OFF_CAMPUS",
      ],
      required: true,
      default: "ON_CAMPUS",
    },

    result: {
      type: String,
      enum: [
        "SELECTED",
        "REJECTED",
        "WAITLISTED",
      ],
      required: true,
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    rounds: [
      roundSchema,
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Experience",
  experienceSchema
);