const express = require("express");

const {

    getCompanies,
    getCompanyDetails,
    getCompanyRoles,
    getRoleExperiences

} = require("./company.controller");

const router = express.Router();

router.get("/", getCompanies);

router.get("/:id", getCompanyDetails);

router.get("/:id/roles", getCompanyRoles);

router.get(
    "/:companyId/roles/:roleId/experiences",
    getRoleExperiences
);

module.exports = router;