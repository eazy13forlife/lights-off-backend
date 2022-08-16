const insertDataToMediaTable = require("../helperFunctions/media");
const { poolQuery, getClient } = require("../db");

const addMedia = async (req, res) => {
  try {
    const mediaData = req.body;

    const response = await insertDataToMediaTable(
      "poolQuery",
      poolQuery,
      mediaData
    );

    const insertedData = response.rows[0];

    res.status(201).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

//gets specific media that user has uploaded
const getMedia = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const mediaResponse = await poolQuery(`
    SELECT * FROM media
    WHERE user_account_id=${userId} AND media_id='${mediaId}'`);

    if (mediaResponse.rowCount === 0) {
      return res.status(404).send();
    }

    const media = mediaResponse.rows[0];

    res.send(media);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

//we can only delete media that belongs to user,so check to see if media id belongs to user
const deleteMedia = (req, res) => {};

//we can only update media that belongs to user
const updateMedia = (req, res) => {};

module.exports = {
  addMedia,
  getMedia,
  deleteMedia,
  updateMedia,
};
