import api from "./api";

/*
========================================
GET ALL EXPERIENCES
========================================
*/

export const getExperiences = () => {
  return api.get("/experiences");
};


/*
========================================
GET EXPERIENCE BY ID
========================================
*/

export const getExperienceById = (id) => {
  return api.get(`/experiences/${id}`);
};


/*
========================================
CREATE EXPERIENCE
========================================
*/

export const createExperience = (experienceData) => {
  return api.post(
    "/experiences",
    experienceData
  );
};


/*
========================================
SEARCH / FILTER EXPERIENCES
========================================
*/

export const searchExperiences = (
  filters = {}
) => {

  const params = {};

  Object.entries(filters).forEach(
    ([key, value]) => {

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params[key] = value;
      }

    }
  );

  return api.get(
    "/experiences/search",
    {
      params,
    }
  );
};


/*
========================================
GET EXPERIENCES BY COMPANY + ROLE
========================================
*/

export const getExperiencesByRole = (
  companyId,
  roleId
) => {

  return api.get(
    "/experiences/search",
    {
      params: {
        company: companyId,
        role: roleId,
      },
    }
  );
};


/*
========================================
DELETE EXPERIENCE
========================================
*/

export const deleteExperience = (
  id
) => {

  return api.delete(
    `/experiences/${id}`
  );
};