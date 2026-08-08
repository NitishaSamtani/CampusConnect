const Role = require("./role.model");

const getRolesByCompany =
  async (req, res) => {
    try {

      const roles =
        await Role.find({
          company:
            req.params.companyId,
        });

      res.status(200).json({
        success: true,
        roles,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

module.exports = {
  getRolesByCompany,
};