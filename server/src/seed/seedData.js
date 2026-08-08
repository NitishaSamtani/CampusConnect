const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Company = require(
  "../modules/companies/company.model"
);

const Role = require(
  "../modules/roles/role.model"
);

dotenv.config();

const seedData = async () => {
  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected"
    );

    await Company.deleteMany();
    await Role.deleteMany();

    const companies =
      await Company.insertMany([
        {
          name: "Amazon",
          description:
            "Amazon Careers",
        },
        {
          name: "Google",
          description:
            "Google Careers",
        },
        {
          name: "Microsoft",
          description:
            "Microsoft Careers",
        },
        {
          name: "Adobe",
          description:
            "Adobe Careers",
        },
      ]);

    const amazon =
      companies.find(
        (c) =>
          c.name === "Amazon"
      );

    const google =
      companies.find(
        (c) =>
          c.name === "Google"
      );

    const microsoft =
      companies.find(
        (c) =>
          c.name === "Microsoft"
      );

    const adobe =
      companies.find(
        (c) =>
          c.name === "Adobe"
      );

    await Role.insertMany([
      {
        title: "SDE Intern",
        company: amazon._id,
      },
      {
        title: "SDE 1",
        company: amazon._id,
      },

      {
        title: "SDE Intern",
        company: google._id,
      },
      {
        title: "ML Engineer",
        company: google._id,
      },

      {
        title: "SDE 1",
        company:
          microsoft._id,
      },
      {
        title:
          "Data Engineer",
        company:
          microsoft._id,
      },

      {
        title:
          "SDE Intern",
        company: adobe._id,
      },
      {
        title:
          "ML Engineer",
        company: adobe._id,
      },
    ]);

    console.log(
      "Data Seeded Successfully"
    );

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);

  }
};

seedData();