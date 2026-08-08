const express = require("express");

const {
  getRolesByCompany,
} = require("./role.controller");

const router =
  express.Router();

router.get(
  "/company/:companyId",
  getRolesByCompany
);

module.exports = router;