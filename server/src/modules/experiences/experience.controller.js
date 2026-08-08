const {
  createExperience,
  getExperiences,
  getExperienceById,
  searchExperiences:
    searchExperiencesService,
  deleteExperience,
} = require("./experience.service");


/*
========================================
CREATE
========================================
*/

const createExperienceController =
  async (req, res) => {

    try {

      const experience =
        await createExperience(
          req.user.userId,
          req.body
        );


      return res.status(201).json({
        success: true,
        experience,
      });

    } catch (error) {

      console.error(
        "Create Experience Error:",
        error
      );


      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };


/*
========================================
GET ALL
========================================
*/

const getExperiencesController =
  async (req, res) => {

    try {

      const experiences =
        await getExperiences();


      return res.status(200).json({
        success: true,
        experiences,
      });

    } catch (error) {

      console.error(
        "Get Experiences Error:",
        error
      );


      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };


/*
========================================
GET BY ID
========================================
*/

const getExperienceByIdController =
  async (req, res) => {

    try {

      const experience =
        await getExperienceById(
          req.params.id
        );


      if (!experience) {

        return res.status(404).json({
          success: false,
          message:
            "Experience not found",
        });

      }


      return res.status(200).json({
        success: true,
        experience,
      });

    } catch (error) {

      console.error(
        "Get Experience Error:",
        error
      );


      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };


/*
========================================
SEARCH
========================================
*/

const searchExperiencesController =
  async (req, res) => {

    try {

      const experiences =
        await searchExperiencesService({

          search:
            req.query.search,

          company:
            req.query.company,

          role:
            req.query.role,

          questionType:
            req.query.questionType,

          difficulty:
            req.query.difficulty,

          campusType:
            req.query.campusType,

          result:
            req.query.result,

        });


      return res.status(200).json({
        success: true,
        experiences,
      });

    } catch (error) {

      console.error(
        "Search Experiences Error:",
        error
      );


      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };


/*
========================================
DELETE
========================================
*/

const deleteExperienceController =
  async (req, res) => {

    try {

      await deleteExperience(
        req.params.id,
        req.user.userId
      );


      return res.status(200).json({
        success: true,
        message:
          "Experience deleted successfully",
      });

    } catch (error) {

      console.error(
        "Delete Experience Error:",
        error
      );


      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };


module.exports = {

  createExperience:
    createExperienceController,

  getExperiences:
    getExperiencesController,

  getExperienceById:
    getExperienceByIdController,

  searchExperiences:
    searchExperiencesController,

  deleteExperience:
    deleteExperienceController,

};