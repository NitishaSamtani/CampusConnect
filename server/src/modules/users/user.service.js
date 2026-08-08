const User = require("./user.model");
const Experience = require("../experiences/experience.model");
const Comment = require("../comments/comment.model");

const getProfile = async (userId) => {
  return await User.findById(userId).select(
    "-password"
  );
};

const updateProfile = async (userId, data) => {
  const allowedFields = {
    name: data.name,
    college: data.college,
    branch: data.branch,
    graduationYear: data.graduationYear,
  };

  return await User.findByIdAndUpdate(
    userId,
    allowedFields,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
};

const getMyExperiences = async (userId) => {
  return await Experience.find({
    user: userId,
  })
    .populate("company", "name")
    .populate("role", "name")
    .sort({ createdAt: -1 });
};

const getMyComments = async (userId) => {
  return await Comment.find({
    userId,
  })
    .populate({
      path: "experienceId",
      populate: [
        {
          path: "company",
          select: "name",
        },
        {
          path: "role",
          select: "name",
        },
      ],
    })
    .sort({ createdAt: -1 });
};

module.exports = {
  getProfile,
  updateProfile,
  getMyExperiences,
  getMyComments,
};