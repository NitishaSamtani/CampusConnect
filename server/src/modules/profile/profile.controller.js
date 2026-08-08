const profileService = require(
  "./profile.service"
);


/*
========================================
GET PROFILE
GET /api/profile
========================================
*/

const getProfile = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.userId;

    const profile =
      await profileService.getProfile(
        userId
      );

    return res.status(200).json({

      success: true,

      profile,

    });

  } catch (error) {

    console.error(
      "Get Profile Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch profile.",

    });

  }
};


/*
========================================
UPDATE PROFILE
PUT /api/profile
========================================
*/

const updateProfile = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.userId;

    const {
      name,
      college,
      branch,
      graduationYear,
    } = req.body;


    /*
    ------------------------------------
    Validation
    ------------------------------------
    */

    if (!name?.trim()) {

      return res.status(400).json({

        success: false,

        message:
          "Name is required.",

      });

    }


    const updatedProfile =
      await profileService.updateProfile(
        userId,
        {
          name:
            name.trim(),

          college:
            college?.trim() || "",

          branch:
            branch?.trim() || "",

          graduationYear:
            graduationYear
              ? Number(graduationYear)
              : null,
        }
      );


    return res.status(200).json({

      success: true,

      message:
        "Profile updated successfully.",

      profile:
        updatedProfile,

    });

  } catch (error) {

    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to update profile.",

    });

  }
};


/*
========================================
MY EXPERIENCES
GET /api/profile/experiences
========================================
*/

const getMyExperiences = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.userId;

    const experiences =
      await profileService.getMyExperiences(
        userId
      );

    return res.status(200).json({

      success: true,

      count:
        experiences.length,

      experiences,

    });

  } catch (error) {

    console.error(
      "Get My Experiences Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch your experiences.",

    });

  }
};


/*
========================================
MY COMMENTS
GET /api/profile/comments
========================================
*/

const getMyComments = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.userId;

    const comments =
      await profileService.getMyComments(
        userId
      );

    return res.status(200).json({

      success: true,

      count:
        comments.length,

      comments,

    });

  } catch (error) {

    console.error(
      "Get My Comments Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch your comments.",

    });

  }
};


/*
========================================
MY ACTIVITY
GET /api/profile/activity
========================================
*/

const getMyActivity = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.userId;

    const activities =
      await profileService.getMyActivity(
        userId
      );

    return res.status(200).json({

      success: true,

      count:
        activities.length,

      activities,

    });

  } catch (error) {

    console.error(
      "Get My Activity Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch your activity.",

    });

  }
};


module.exports = {

  getProfile,

  updateProfile,

  getMyExperiences,

  getMyComments,

  getMyActivity,

};