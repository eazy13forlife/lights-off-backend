const { poolQuery } = require("../db");
const { insertDataToMediaTable } = require("../helperFunctions/media");
const {
  updateTableValues,
  insertDataToTable,
} = require("../helperFunctions/global");

const noRecordMessage = (userId, mediaId) => {
  return `media_id ${mediaId} is not found for user_account_id ${userId}.`;
};

//adds both imdb and user uploaded media
const addMedia = async (req, res) => {
  try {
    const mediaData = req.body;

    /*
    const response = await insertDataToMediaTable(
      "poolQuery",
      poolQuery,
      mediaData
    );
*/
    const insertResponse = await insertDataToTable("media", mediaData);

    const insertedData = insertResponse.rows[0];

    res.status(201).send(insertedData);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

//gets specific media that user has uploaded. We cant get imdb media, we will use themoviedb api for that
const getMedia = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const response = await poolQuery(
      `SELECT * FROM media
        WHERE media_id='${mediaId}' AND user_account_id=${userId}`
    );

    if (response.rowCount === 0) {
      return res.status(404).send(noRecordMessage(userId, mediaId));
    }
    res.send(response.rows);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

//we can only delete media that belongs to user,so check to see if media id belongs to user
const deleteMedia = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const response = await poolQuery(
      `DELETE FROM media
      WHERE media_id='${mediaId}' AND user_account_id=${userId}`
    );

    if (response.rowCount === 0) {
      return res.status(404).send(noRecordMessage(userId, mediaId));
    }

    res.status(200).send(response.rows);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

//we can only update media that belongs to user
const updateMedia = async (req, res) => {
  try {
    const updateData = req.body;

    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const updateResponse = await updateTableValues(
      "media",
      updateData,
      `media_id='${mediaId}' AND user_account_id=${userId}`
    );

    if (updateResponse.rowCount == 0) {
      return res.status(404).send(noRecordMessage(userId, mediaId));
    }

    res.send(updateResponse.rows);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = {
  addMedia,
  getMedia,
  deleteMedia,
  updateMedia,
};
