const { poolQuery } = require("../db");
const {
  preventUserAccessingMedia,
} = require("../../src/helperFunctions/media/index.js");

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

    const insertedData = insertResponse.rows[0];

    res.send(insertedData);
  } catch (e) {
    res.status(400).send(e.message);
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

    const seenResponse = await poolQuery(
      `SELECT * FROM user_seen
      WHERE user_account_id=${userId}`
    );

    const allSeen = seenResponse.rows;

    res.send(allSeen);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = {
  addToSeen,
  deleteFromSeen,
  getAllSeen,
};
