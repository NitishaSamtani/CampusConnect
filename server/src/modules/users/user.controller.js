const userService = require("./user.service");

const getProfile = async (req, res) => {
  try {
    const user =
      await userService.getProfile(
        req.user.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(
      "Get Profile Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user =
      await userService.updateProfile(
        req.user.userId,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

const getMyExperiences = async (req, res) => {
  try {
    const experiences =
      await userService.getMyExperiences(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      experiences,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch experiences",
    });
  }
};

const getMyComments = async (req, res) => {
  try {
    const comments =
      await userService.getMyComments(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      comments,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch comments",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMyExperiences,
  getMyComments,
};