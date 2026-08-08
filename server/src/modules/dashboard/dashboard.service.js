const Experience = require(
  "../experiences/experience.model"
);

const Comment = require(
  "../comments/comment.model"
);

const Company = require(
  "../companies/company.model"
);

const getDashboardData =
  async (userId) => {

    const experiencesPosted =
      await Experience.countDocuments({
        user: userId,
      });

    const commentsAdded =
      await Comment.countDocuments({
        userId,
      });

    const latestExperiences =
      await Experience.find()
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
        })
        .limit(5);

    const liveDiscussions =
      await Comment.find()
        .populate(
          "userId",
          "name"
        )
        .sort({
          createdAt: -1,
        })
        .limit(8);

    const resultAnalytics =
      await Experience.aggregate([
        {
          $group: {
            _id: "$result",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const companyTrends =
      await Experience.aggregate([
        {
          $group: {
            _id: "$company",
            total: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
        {
          $limit: 5,
        },
      ]);

    const populatedCompanies =
  await Company.populate(
    companyTrends,
    {
      path: "_id",
      select: "name",
    }
  );

    return {
      experiencesPosted,
      commentsAdded,
      latestExperiences,
      liveDiscussions,
      resultAnalytics,
      companyTrends:
  populatedCompanies,
    };
  };

module.exports = {
  getDashboardData,
};