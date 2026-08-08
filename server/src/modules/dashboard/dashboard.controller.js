const {
  getDashboardData,
} = require(
  "./dashboard.service"
);

const getDashboard =
  async (req, res) => {

    try {

      const data =
        await getDashboardData(
          req.user.userId
        );

      res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

module.exports = {
  getDashboard,
};