const { poolQuery } = require("../db");
const {
  preventUserAccessingMedia,
  checkMediaExistsInTableForUser,
} = require("../helperFunctions/media/index");
const { getPaginatedItems } = require("../helperFunctions/global.js");

const addToWatchNext = async (req, res) => {
  try {
    const { priority_level = null } = req.body;

    //make sure priority_level user enters is allowed
    if (priority_level) {
      const choices = ["low", "medium", "high"];

      if (!choices.includes(priority_level)) {
        return res
          .status(400)
          .send(`Priority level must be low,medium or high`);
      }
    }

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

    await poolQuery(
      `INSERT INTO user_watch_next(user_account_id,media_id,priority_level) VALUES($1,$2,$3) RETURNING *`,
      [userId, mediaId, priority_level]
    );

    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const checkMediaInWatchNext = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const response = await checkMediaExistsInTableForUser(
      "user_watch_next",
      mediaId,
      userId
    );

    return res.status(response.statusCode).send();
  } catch (e) {
    res.status(400).send();
  }
};

const deleteFromWatchNext = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const deleteResponse = await poolQuery(
      `DELETE FROM user_watch_next
      WHERE media_id='${mediaId}' AND user_account_id=${userId}`
    );

    if (deleteResponse.rowCount === 0) {
      return res
        .status(404)
        .send(
          `media_id ${mediaId} is not found for user_account_id ${userId}.`
        );
    }

    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const getAllWatchNext = async (req, res) => {
  try {
    const userId = req.user.user_account_id;

    //get current page asked for from query.Then, convert to number
    const page = +req.query.page;

    const { status, message } = await getPaginatedItems(
      page,
      userId,
      "user_watch_next"
    );

    return res.status(status).send(message);
  } catch (e) {
    res.status(400).send();
  }
};

module.exports = {
  addToWatchNext,
  deleteFromWatchNext,
  getAllWatchNext,
  checkMediaInWatchNext,
};
