const User = require("../users/user.model");
const Experience = require("../experiences/experience.model");
const Comment = require("../comments/comment.model");

/*
========================================
GET PROFILE
========================================
*/

const getProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "-password"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


/*
========================================
UPDATE PROFILE
========================================
*/

const updateProfile = async (
  userId,
  profileData
) => {
  const {
    name,
    college,
    branch,
    graduationYear,
  } = profileData;

  const updatedUser =
    await User.findByIdAndUpdate(
      userId,
      {
        name,
        college,
        branch,
        graduationYear,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};


/*
========================================
MY EXPERIENCES
========================================
*/

const getMyExperiences = async (
  userId
) => {
  return await Experience.find({
    user: userId,
  })
    .populate("company", "name logo")
    .populate("role", "title")
    .sort({
      createdAt: -1,
    });
};


/*
========================================
MY COMMENTS
========================================
*/

const getMyComments = async (
  userId
) => {
  return await Comment.find({
    userId,
  })
    .populate(
      "experienceId",
      "college result interviewDate"
    )
    .sort({
      createdAt: -1,
    });
};


/*
========================================
MY ACTIVITY
========================================
*/

const getMyActivity = async (
  userId
) => {

  const experiences =
    await Experience.find({
      user: userId,
    })
      .populate("company", "name")
      .populate("role", "title")
      .sort({
        createdAt: -1,
      });

  const comments =
    await Comment.find({
      userId,
    })
      .populate(
        "experienceId",
        "college result"
      )
      .sort({
        createdAt: -1,
      });


  const activities = [];


  /*
  ----------------------------------------
  Experience Activities
  ----------------------------------------
  */

  experiences.forEach(
    (experience) => {

      activities.push({
        type: "EXPERIENCE",

        message:
          `Shared an interview experience ` +
          `for ${
            experience.company?.name ||
            "a company"
          }`,

        relatedId:
          experience._id,

        createdAt:
          experience.createdAt,
      });

    }
  );


  /*
  ----------------------------------------
  Comment Activities
  ----------------------------------------
  */

  comments.forEach(
    (comment) => {

      activities.push({
        type: "COMMENT",

        message:
          "Posted a comment on an interview experience",

        relatedId:
          comment.experienceId?._id,

        createdAt:
          comment.createdAt,
      });

    }
  );


  /*
  ----------------------------------------
  Sort Latest First
  ----------------------------------------
  */

  activities.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );


  return activities;
};


module.exports = {
  getProfile,
  updateProfile,
  getMyExperiences,
  getMyComments,
  getMyActivity,
};