const { poolQuery } = require("../db");

const addToSeen = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const mediaResponse = await poolQuery(
      `SELECT * FROM media
      WHERE media_id='${mediaId}'`
    );

    if (mediaResponse.rows == 0) {
      return res
        .status(404)
        .send(`media_id ${mediaId} is not found for user_account_id ${userId}`);
    }
    const correspondentUserId = mediaResponse.rows[0].user_account_id;

    if (correspondentUserId !== userId) {
      return res
        .status(404)
        .send(`media_id ${mediaId} is not found for user_account_id ${userId}`);
    }

    const response = await poolQuery(
      `INSERT INTO user_seen(user_account_id,media_id) VALUES($1,$2)
      RETURNING *`,
      [userId, mediaId]
    );

    const insertedData = response.rows[0];

    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const deleteFromSeen = (req, res) => {};

const getAllSeen = (req, res) => {};

module.exports = {
  addToSeen,
  deleteFromSeen,
  getAllSeen,
};
