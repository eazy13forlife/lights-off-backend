const { poolQuery } = require("../db");

const { preventUserAccessingMedia } = require("../helperFunctions/media");

//user can add review for any imdb movie and their uploaded movie
const addReview = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const shouldPreventAccess = await preventUserAccessingMedia(
      userId,
      mediaId
    );

    if (shouldPreventAccess) {
      return res
        .status(shouldPreventAccess.errorCode)
        .send(shouldPreventAccess.errorMessage);
    }

    const { review, rating } = req.body;

    const insertResponse = await poolQuery(
      `INSERT INTO user_review(user_account_id,media_id,review,rating) VALUES($1,$2,$3,$4) RETURNING *`,
      [userId, mediaId, review, rating]
    );

    res.status(201).send(insertResponse.rows[0]);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const editReview = (req, res) => {};

const getReviewsForMedia = (req, res) => {};

const deleteReview = (req, res) => {};

const getAllMyReviews = (req, res) => {};

module.exports = {
  addReview,
  editReview,
  getReviewsForMedia,
  deleteReview,
  getAllMyReviews,
};
