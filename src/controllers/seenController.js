const { poolQuery } = require("../db");
const { findMediaOfUser } = require("../../src/helperFunctions/media/index.js");

//user can add any imdb movie and any movie theyve uploaded to seen
const addToSeen = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const mediaResponse = await poolQuery(
      `SELECT * FROM media
      WHERE media_id='${mediaId}'`
    );

    //the media is not found at all in mediaTable
    if (mediaResponse.rowCount === 0) {
      return res.status(404).send(`media_id ${mediaId} is not found.`);
    }

    const userIdForMedia = mediaResponse.rows[0].user_account_id;

    //the userId exists for the media but doesnt match the userId of current user
    if (userIdForMedia !== userId) {
      return res
        .status(404)
        .send(
          `media_id ${mediaId} is not found for user_account_id ${userId}.`
        );
    }

    //either no userId associated with the media, meaning its imdb or ids match so we can add to seen
    const insertResponse = await poolQuery(
      `INSERT INTO user_seen(user_account_id,media_id) VALUES($1,$2)
        RETURNING *`,
      [userId, mediaId]
    );

    const insertedData = insertResponse.rows[0];

    res.send(insertedData);
  } catch (e) {
    res.status(500).send(e.message);
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
    res.status(500).send(e.message);
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
    res.status(500).send(e.message);
  }
};

module.exports = {
  addToSeen,
  deleteFromSeen,
  getAllSeen,
};
