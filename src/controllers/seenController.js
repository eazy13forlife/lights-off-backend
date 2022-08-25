const { poolQuery } = require("../db");
const { findMediaOfUser } = require("../../src/helperFunctions/media/index.js");

const addToSeen = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const mediaData = await findMediaOfUser(userId, mediaId);

    if (!mediaData) {
      return res
        .status(404)
        .send(`media_id ${mediaId} is not found for user_account_id ${userId}`);
    }

    const insertResponse = await poolQuery(
      `INSERT INTO user_seen(user_account_id,media_id) VALUES($1,$2)
      RETURNING *`,
      [userId, mediaId]
    );

    const insertedData = insertResponse.rows[0];

    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteFromSeen = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const mediaData = await findMediaOfUser(userId, mediaId);

    if (!mediaData) {
      return res
        .status(404)
        .send(`media_id ${mediaId} is not found for user_account_id ${userId}`);
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
