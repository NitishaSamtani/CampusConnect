const Company = require("./company.model");
const Role = require("../roles/role.model");
const Experience = require("../experiences/experience.model");

/*
==================================
All Companies
==================================
*/

const getCompanies = async (req, res) => {

    try {

        const companies = await Company.find().sort({ name: 1 });

        const data = await Promise.all(

            companies.map(async (company) => {

                const count =
                    await Experience.countDocuments({
                        company: company._id
                    });

                return {

                    _id: company._id,
                    name: company.name,
                    logo: company.logo,
                    description: company.description,
                    experienceCount: count

                };

            })

        );

        res.json({

            success: true,
            companies: data

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

/*
==================================
Get Company Details
==================================
*/

const getCompanyDetails = async (req, res) => {

    try {

        const company = await Company.findById(req.params.id);

        if (!company) {

            return res.status(404).json({

                success: false,
                message: "Company not found"

            });

        }

        res.status(200).json({

            success: true,
            company

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

/*
==================================
Roles of Company
==================================
*/

const getCompanyRoles = async (req, res) => {

    try {

        const roles = await Role.find({

            company: req.params.id

        }).sort({ title: 1 });

        const data = await Promise.all(

            roles.map(async (role) => {

                const count =
                    await Experience.countDocuments({

                        company: req.params.id,
                        role: role._id

                    });

                return {

                    _id: role._id,
                    title: role.title,
                    experienceCount: count

                };

            })

        );

        res.json({

            success: true,
            roles: data

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

/*
==================================
Experiences of Role
==================================
*/

const getRoleExperiences = async (req, res) => {

    try {

        const experiences =
            await Experience.find({

                company: req.params.companyId,
                role: req.params.roleId

            })

            .populate("user", "name")
            .sort({

                interviewDate: -1

            });

        res.json({

            success: true,
            experiences

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

module.exports = {

    getCompanies,
    getCompanyDetails,
    getCompanyRoles,
    getRoleExperiences
    

};