const { poolQuery } = require("../db");

const { preventUserAccessingMedia } = require("../helperFunctions/media");
const {
  updateTableValues,
  insertDataToTable,
} = require("../helperFunctions/global");

const noRecordMessage = (userId, mediaId) => {
  return `A review for media_id ${mediaId} does not exist for user_account_id ${userId}`;
};

//user can add review for any imdb movie and their uploaded movie
const addReview = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    //add the media_id and user_account_id to the current req.body
    const updatedRequestBody = {
      ...req.body,
      user_account_id: userId,
      media_id: mediaId,
    };

    const shouldPreventAccess = await preventUserAccessingMedia(
      userId,
      mediaId
    );

    if (shouldPreventAccess) {
      return res
        .status(shouldPreventAccess.errorCode)
        .send(shouldPreventAccess.errorMessage);
    }

    const insertResponse = await insertDataToTable(
      "user_review",
      updatedRequestBody
    );

    res.status(201).send(insertResponse.rows[0]);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const editReview = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const updateResponse = await updateTableValues(
      "user_review",
      req.body,
      `media_id='${mediaId}'AND user_account_id=${userId}`
    );

    if (updateResponse.rowCount === 0) {
      return res.status(404).send(noRecordMessage(userId, mediaId));
    }

    res.send(updateResponse.rows);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const getReviewsForMedia = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const mediaResponse = await poolQuery(
      `SELECT * FROM media
        WHERE media_id='${mediaId}'`
    );

    if (mediaResponse.rowCount === 0) {
      return res.status(400).send(`media_is ${mediaId} does not exist`);
    }

    const response = await poolQuery(
      `SELECT review,rating FROM user_review
      WHERE media_id='${mediaId}'`
    );

    const allReviews = response.rows;

    res.send(allReviews);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const deleteReview = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const deleteResponse = await poolQuery(
      `DELETE FROM user_review
      WHERE media_id='${mediaId}' AND user_account_id=${userId}`
    );

    if (deleteResponse.rowCount === 0) {
      return res.status(400).send(noRecordMessage(userId, mediaId));
    }

    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
};

const getAllMyReviews = (req, res) => {};

module.exports = {
  addReview,
  editReview,
  getReviewsForMedia,
  deleteReview,
  getAllMyReviews,
};
