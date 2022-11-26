const { poolQuery } = require("../db");
const {
  preventUserAccessingMedia,
  checkMediaExistsInTableForUser,
} = require("../../src/helperFunctions/media/index.js");
const {
  getPaginatedItems,
  getPaginatedSearchItems,
} = require("../helperFunctions/global.js");

//user can add any imdb movie and any movie theyve uploaded to seen
const addToSeen = async (req, res) => {
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

    const insertResponse = await poolQuery(
      `INSERT INTO user_seen(user_account_id,media_id) VALUES($1,$2)
        RETURNING *`,
      [userId, mediaId]
    );

    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const checkMediaInSeen = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const response = await checkMediaExistsInTableForUser(
      "user_seen",
      mediaId,
      userId
    );

    return res.status(response.statusCode).send();
  } catch (e) {
    res.status(400).send();
  }
};

//make sure user is only deleting media that theyve uploaded to seen
const deleteFromSeen = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    seenResponse = await poolQuery(
      `SELECT * FROM user_seen
      WHERE user_account_id=${userId} AND media_id='${mediaId}'`
    );

    if (seenResponse.rowCount === 0) {
      return res
        .status(404)
        .send(
          `media_id ${mediaId} is not found for user_account_id ${userId}.`
        );
    }

    await poolQuery(
      `DELETE FROM user_seen
      WHERE user_account_id=${userId} AND media_id='${mediaId}'`
    );

    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const getAllSeen = async (req, res) => {
  try {
    const userId = req.user.user_account_id;

    //get current page asked for from query.Convert to number
    const page = +req.query.page;

    const { status, message } = await getPaginatedItems(
      page,
      userId,
      "user_seen"
    );

    return res.status(status).send(message);
  } catch (e) {
    res.status(400).send();
  }
};

const searchInSeen = async (req, res) => {
  try {
    const userId = req.user.user_account_id;

    const mediaTitle = req.query.title;

    const page = +req.query.page;

    const { status, message } = await getPaginatedSearchItems(
      mediaTitle,
      page,
      userId,
      "user_seen"
    );

    res.status(status).send(message);
  } catch (e) {
    res.status(400).send();
  }
};

module.exports = {
  addToSeen,
  deleteFromSeen,
  getAllSeen,
  checkMediaInSeen,
  searchInSeen,
};
