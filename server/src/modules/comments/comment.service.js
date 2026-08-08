const Comment = require(
  "./comment.model"
);

const createComment =
  async (data) => {
    return await Comment.create(
      data
    );
  };

const getComments =
  async (experienceId) => {
    return await Comment.find({
      experienceId,
    })
      .populate(
        "userId",
        "name"
      )
      .sort({
        createdAt: -1,
      });
  };

module.exports = {
  createComment,
  getComments,
};