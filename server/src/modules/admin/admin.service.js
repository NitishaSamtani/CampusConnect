const User = require(
  "../users/user.model"
);

const Company = require(
  "../companies/company.model"
);

const Experience = require(
  "../experiences/experience.model"
);

/*
==================================================
DASHBOARD STATISTICS
==================================================
*/

const getDashboardStats =
  async () => {

    const [
      totalUsers,
      blockedUsers,
      totalCompanies,
      totalExperiences,
    ] = await Promise.all([

      User.countDocuments({
        role: "USER",
      }),

      User.countDocuments({
        role: "USER",
        isBlocked: true,
      }),

      Company.countDocuments(),

      Experience.countDocuments(),
    ]);

    return {
      totalUsers,
      blockedUsers,
      totalCompanies,
      totalExperiences,
    };
  };


/*
==================================================
GET ALL USERS
==================================================
*/

const getAllUsers =
  async () => {

    return await User.find({
      role: "USER",
    })
      .select(
        "-password"
      )
      .sort({
        createdAt: -1,
      });
  };


/*
==================================================
BLOCK USER
==================================================
*/

const blockUser =
  async (userId) => {

    const user =
      await User.findOneAndUpdate(
        {
          _id: userId,
          role: "USER",
        },
        {
          isBlocked: true,
        },
        {
          new: true,
        }
      ).select("-password");

    if (!user) {
      throw new Error(
        "User not found."
      );
    }

    return user;
  };


/*
==================================================
UNBLOCK USER
==================================================
*/

const unblockUser =
  async (userId) => {

    const user =
      await User.findOneAndUpdate(
        {
          _id: userId,
          role: "USER",
        },
        {
          isBlocked: false,
        },
        {
          new: true,
        }
      ).select("-password");

    if (!user) {
      throw new Error(
        "User not found."
      );
    }

    return user;
  };


/*
==================================================
DELETE USER
==================================================
*/

const deleteUser =
  async (userId) => {

    const user =
      await User.findOne({
        _id: userId,
        role: "USER",
      });

    if (!user) {
      throw new Error(
        "User not found."
      );
    }

    await User.findByIdAndDelete(
      userId
    );

    return user;
  };


module.exports = {
  getDashboardStats,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
};