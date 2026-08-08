const Experience = require("./experience.model");

const Company = require(
  "../companies/company.model"
);

const Role = require(
  "../roles/role.model"
);


/*
========================================
CREATE EXPERIENCE
========================================
*/

const createExperience = async (
  userId,
  data
) => {

  let companyId = data.companyId;


  /*
  ----------------------------------------
  COMPANY
  ----------------------------------------
  */

  if (!companyId) {

    if (!data.companyName) {
      throw new Error(
        "Company is required"
      );
    }

    let company =
      await Company.findOne({
        name: {
          $regex: new RegExp(
            `^${data.companyName.trim()}$`,
            "i"
          ),
        },
      });

    if (!company) {
      company =
        await Company.create({
          name:
            data.companyName.trim(),
        });
    }

    companyId = company._id;
  }


  /*
  ----------------------------------------
  ROLE
  ----------------------------------------
  */

  let roleId = data.roleId;

  if (!roleId) {

    if (!data.roleName) {
      throw new Error(
        "Role is required"
      );
    }

    let role =
      await Role.findOne({
        company: companyId,

        title: {
          $regex: new RegExp(
            `^${data.roleName.trim()}$`,
            "i"
          ),
        },
      });

    if (!role) {

      role =
        await Role.create({
          company: companyId,

          title:
            data.roleName.trim(),
        });

    }

    roleId = role._id;
  }


  /*
  ----------------------------------------
  EXPERIENCE
  ----------------------------------------
  */

  const experience =
    await Experience.create({

      user: userId,

      company: companyId,

      role: roleId,

      college:
        data.college,

      campusType:
        data.campusType ||
        "ON_CAMPUS",

      result:
        data.result,

      interviewDate:
        data.interviewDate,

      rounds:
        data.rounds || [],
    });


  return experience;
};


/*
========================================
GET ALL EXPERIENCES
========================================
*/

const getExperiences =
  async () => {

    return await Experience.find()

      .populate(
        "user",
        "name college branch"
      )

      .populate(
        "company",
        "name"
      )

      .populate(
        "role",
        "title"
      )

      .sort({
        createdAt: -1,
      });
  };


/*
========================================
GET EXPERIENCE BY ID
========================================
*/

const getExperienceById =
  async (id) => {

    return await Experience.findById(id)

      .populate(
        "user",
        "name college branch"
      )

      .populate(
        "company",
        "name"
      )

      .populate(
        "role",
        "title"
      );
  };


/*
========================================
SEARCH / FILTER EXPERIENCES
========================================
*/

const searchExperiences =
  async ({
    search,
    company,
    role,
    questionType,
    difficulty,
    campusType,
    result,
  }) => {

    const query = {};


    /*
    ----------------------------------------
    COMPANY
    ----------------------------------------
    */

    if (company) {
      query.company = company;
    }


    /*
    ----------------------------------------
    ROLE
    ----------------------------------------
    */

    if (role) {
      query.role = role;
    }


    /*
    ----------------------------------------
    CAMPUS
    ----------------------------------------
    */

    if (campusType) {
      query.campusType =
        campusType;
    }


    /*
    ----------------------------------------
    RESULT
    ----------------------------------------
    */

    if (result) {
      query.result = result;
    }


    /*
    ----------------------------------------
    QUESTION TYPE
    ----------------------------------------
    */

    if (questionType) {

      query[
        "rounds.questions.questionType"
      ] = questionType;

    }


    /*
    ----------------------------------------
    DIFFICULTY
    ----------------------------------------
    */

    if (difficulty) {

      query[
        "rounds.questions.difficulty"
      ] = difficulty;

    }


    /*
    ----------------------------------------
    TEXT SEARCH
    ----------------------------------------
    */

    if (
      search &&
      search.trim()
    ) {

      const regex =
        new RegExp(
          search.trim(),
          "i"
        );


      /*
      Search directly in Experience
      */

      query.$or = [

        {
          college: regex,
        },

      ];
    }


    /*
    ----------------------------------------
    DATABASE QUERY
    ----------------------------------------
    */

    return await Experience.find(query)

      .populate(
        "user",
        "name college branch"
      )

      .populate(
        "company",
        "name"
      )

      .populate(
        "role",
        "title"
      )

      .sort({
        createdAt: -1,
      });
  };


/*
========================================
DELETE EXPERIENCE
========================================
*/

const deleteExperience =
  async (
    id,
    userId
  ) => {

    const experience =
      await Experience.findById(id);


    if (!experience) {
      throw new Error(
        "Experience not found"
      );
    }


    if (
      experience.user.toString() !==
      userId.toString()
    ) {

      throw new Error(
        "You are not authorized to delete this experience"
      );

    }


    await experience.deleteOne();

    return experience;
  };


module.exports = {

  createExperience,

  getExperiences,

  getExperienceById,

  searchExperiences,

  deleteExperience,

};