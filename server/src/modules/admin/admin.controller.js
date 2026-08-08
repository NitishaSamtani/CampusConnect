const adminService = require(
  "./admin.service"
);


/*
==================================================
DASHBOARD
==================================================
*/

const getDashboardStats =
  async (req, res) => {

    try {

      const stats =
        await adminService
          .getDashboardStats();

      return res.status(200).json({
        success: true,
        stats,
      });

    } catch (error) {

      console.error(
        "Admin Dashboard Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load dashboard.",
      });
    }
  };


/*
==================================================
GET USERS
==================================================
*/

const getUsers =
  async (req, res) => {

    try {

      const users =
        await adminService
          .getAllUsers();

      return res.status(200).json({
        success: true,
        users,
      });

    } catch (error) {

      console.error(
        "Get Users Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load users.",
      });
    }
  };


/*
==================================================
BLOCK USER
==================================================
*/

const blockUser =
  async (req, res) => {

    try {

      const user =
        await adminService
          .blockUser(
            req.params.userId
          );

      return res.status(200).json({
        success: true,
        message:
          "User blocked successfully.",
        user,
      });

    } catch (error) {

      console.error(
        "Block User Error:",
        error
      );

      return res.status(404).json({
        success: false,
        message:
          error.message,
      });
    }
  };


/*
==================================================
UNBLOCK USER
==================================================
*/

const unblockUser =
  async (req, res) => {

    try {

      const user =
        await adminService
          .unblockUser(
            req.params.userId
          );

      return res.status(200).json({
        success: true,
        message:
          "User unblocked successfully.",
        user,
      });

    } catch (error) {

      console.error(
        "Unblock User Error:",
        error
      );

      return res.status(404).json({
        success: false,
        message:
          error.message,
      });
    }
  };


/*
==================================================
DELETE USER
==================================================
*/

const deleteUser =
  async (req, res) => {

    try {

      await adminService
        .deleteUser(
          req.params.userId
        );

      return res.status(200).json({
        success: true,
        message:
          "User deleted successfully.",
      });

    } catch (error) {

      console.error(
        "Delete User Error:",
        error
      );

      return res.status(404).json({
        success: false,
        message:
          error.message,
      });
    }
  };


module.exports = {
  getDashboardStats,
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
};