import api from "./api";

/*
==================================================
GET ALL COMPANIES
==================================================
*/

export const getCompanies = async () => {
  const response = await api.get("/companies");

  return response.data;
};

/*
==================================================
GET COMPANY BY ID
==================================================
*/

export const getCompany = async (companyId) => {
  const response = await api.get(
    `/companies/${companyId}`
  );

  return response.data;
};

/*
==================================================
GET ROLES FOR COMPANY
==================================================
*/

export const getRoles = async (companyId) => {
  const response = await api.get(
    `/companies/${companyId}/roles`
  );

  return response.data;
};

/*
==================================================
GET COMPANY ROLES
--------------------------------------------------
Alias kept so older components using
getCompanyRoles() will also work.
==================================================
*/

export const getCompanyRoles = async (companyId) => {
  const response = await getRoles(companyId);

  return response;
};