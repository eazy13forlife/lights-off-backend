const {
  insertDataToMediaTable,
  findMediaOfUser,
  updateMediaTableValues,
} = require("../helperFunctions/media");
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

    const media = await findMediaOfUser(userId, mediaId);

    if (!media) {
      return res.status(400).send();
    }

    res.send(media);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

//we can only delete media that belongs to user,so check to see if media id belongs to user
const deleteMedia = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const media = await findMediaOfUser(userId, mediaId);

    if (!media) {
      return res.status(404).send();
    }

    const response = await poolQuery(
      `DELETE FROM media
      WHERE media_id='${mediaId}'`
    );

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
};

//we can only update media that belongs to user
const updateMedia = async (req, res) => {
  try {
    console.log(
      updateMediaTableValues("sfssf", { media_id: "yes", title: "i love" })
    );
    const updateData = req.body;

    const mediaId = req.params.mediaId;

    const response = await poolQuery(
      `UPDATE media
      SET title=$1
      WHERE media_id='${mediaId}'
      RETURNING *`,
      ["hello"]
    );

    console.log(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = {
  addMedia,
  getMedia,
  deleteMedia,
  updateMedia,
};
